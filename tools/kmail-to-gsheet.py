import asyncio
from typing import Dict, List, Optional
import json
from os import path, getenv

import gspread
from gspread.exceptions import WorksheetNotFound
from gspread.utils import rowcol_to_a1
from libkol import Session

SPREADSHEET_ID = getenv("SPREADSHEET_ID")
KOL_USERNAME = getenv("KOL_USERNAME")
KOL_PASSWORD = getenv("KOL_PASSWORD")

CREDENTIALS_FILE = path.join(path.dirname(__file__), "credentials.json")


async def main():
    gc = gspread.service_account(filename=CREDENTIALS_FILE)
    sheet = gc.open_by_key(SPREADSHEET_ID)

    worksheets = {}

    async with Session() as kol:
        await kol.login(KOL_USERNAME, KOL_PASSWORD)

        messages = await kol.kmail.get()

        for message in messages:
            error = None
            data = None # type: Optional[Dict[str, str]]

            try:
                text = message.text.replace(" ", "").replace("+", " ")
                data = json.loads(text)
                version = data.pop("_VERSION", "")
                data = {"_user_id": str(message.user_id), "_version": version, **data}

                project = data.pop("_PROJECT", None)
                if project is None:
                    error = "No project key"
                else:
                    if project not in worksheets:
                        try:
                            ws = sheet.worksheet(project)
                            values = ws.get_all_values()
                            headers = values[0]
                        except WorksheetNotFound:
                            headers = list(data.keys())
                            ws = sheet.add_worksheet(title=project, rows=1, cols=len(headers))
                            values = [headers]
                    else:
                        values = worksheets[project]
                        headers = values[0]

                    data_to_insert = [data.get(k, '') for k in headers]

                    if any(i for i in range(2, len(values)) if values[i] == data_to_insert):
                        error = "Discarded as duplicate"
                    else:
                        values.append(data_to_insert)
                        worksheets[project] = values

            except json.JSONDecodeError:
                project = "Unknown"
                error = "Error decoding message"
            
            if error is not None:
                print(f"[{message.username} -> {project}] {error}")
            else:
                print(f"[{message.username} -> {project}] Success")

            if data is not None:
                print(f"  {str(data)}")

            await kol.kmail.delete(message.id)

        for project, values in worksheets.items():
            ws = sheet.worksheet(project)
            ws.format(f"A1:{rowcol_to_a1(1, len(values[0]))}", {"textFormat": {"bold": True}})
            ws.resize(rows=len(values))
            ws.update(values)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()
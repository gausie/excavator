import asyncio
from typing import Dict, List, Optional
import json
from os import path, getenv
from urllib import parse
import gspread
from gspread.exceptions import WorksheetNotFound
from gspread.utils import rowcol_to_a1
from libkol import Session

SPREADSHEET_ID = getenv("SPREADSHEET_ID")
KOL_USERNAME = getenv("KOL_USERNAME")
KOL_PASSWORD = getenv("KOL_PASSWORD")

CREDENTIALS_FILE = path.join(path.dirname(__file__), "credentials.json")


def compare_project(project: str, headers: List[str], a: List[str], b: List[str]) -> bool:
    comparable_keys = [i for i, key in enumerate(headers) if key.startswith("_") is False]
    return [v for i, v in enumerate(a) if i in comparable_keys] == [v for i, v in enumerate(b) if i in comparable_keys]


async def main():
    gc = gspread.service_account(filename=CREDENTIALS_FILE)
    sheet = gc.open_by_key(SPREADSHEET_ID)

    worksheets = {}
    worksheet_handles = {}
    worksheet_new_rows = {}

    async with Session() as kol:
        await kol.login(KOL_USERNAME, KOL_PASSWORD)

        messages = await kol.kmail.get()

        messages_to_delete = []

        for message in messages:
            error = None
            data = None # type: Optional[Dict[str, str]]

            try:
                text = message.text.replace(" ", "")
                if text.startswith("%"):
                    text = parse.unquote_plus(text)
                else:
                    text = text.replace("+", " ")
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
                        worksheets[project] = values
                        worksheet_handles[project] = ws
                    else:
                        values = worksheets[project]
                        headers = values[0]

                    data_to_insert = [data.get(k, "") for k in headers]

                    if any(i for i in range(1, len(values)) if compare_project(project, headers, values[i], data_to_insert)):
                        error = "Discarded as duplicate"
                    else:
                        values.append(data_to_insert)
                        worksheets[project] = values
                        old_new_rows = worksheet_new_rows.get(project, [])
                        old_new_rows.append(data_to_insert)
                        worksheet_new_rows[project] = old_new_rows

            except json.JSONDecodeError:
                project = "Unknown"
                error = "Error decoding message"
            
            if error is not None:
                print(f"[{message.username} -> {project}] {error}")
            else:
                print(f"[{message.username} -> {project}] Success")

            if data is not None:
                print(f"  {str(data)}")

            messages_to_delete.append(message.id)

        for project, new_data in worksheet_new_rows.items():
            ws = worksheet_handles[project]
            # ws.format(f"A1:{rowcol_to_a1(1, len(values[0]))}", {"textFormat": {"bold": True}})
            ws.append_rows(new_data)

        for mid in messages_to_delete:
            await kol.kmail.delete(mid)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()

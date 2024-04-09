import {
  Item,
  Location,
  Modifier,
  currentRound,
  equippedAmount,
  getProperty,
  myLocation,
  numericModifier,
} from "kolmafia";

import { ExcavatorProject } from "../type";

export const OUT_OF_ORDER: ExcavatorProject = {
  name: "Out of Order",
  description:
    "Determine the relationship between initiative bonus and beeps from the GPS-tracking wristwatch during the Out of Order quest.",
  author: "gausie",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // Must be on the quest
      if (getProperty("questEspOutOfOrder") === "unstarted") return null;
      // Must be end of battle
      if (currentRound() !== 0) return null;
      // Must be wearing the wristwatch
      if (equippedAmount(Item.get("GPS-tracking wristwatch")) < 1) return null;
      // Must be in the jungle
      if (myLocation() !== Location.get("The Deep Dark Jungle")) return null;
      const beeps = page.match(
        /Your GPS tracker beeps ([0-9]+) times as it zeroes in on your quarry/,
      );
      if (!beeps) return null;
      return {
        beeps: beeps[1],
        initiative: numericModifier(Modifier.get("Initiative")),
      };
    },
  },
};

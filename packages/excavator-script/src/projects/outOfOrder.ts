/**
 * @author gausie
 * Determine the relationship between initiative bonus and beeps from the GPS-tracking wristwatch during the Out of Order quest
 */
import {
  currentRound,
  equippedAmount,
  myLocation,
  numericModifier,
} from "kolmafia";
import { $item, $location, $modifier, questStep } from "libram";

import { ExcavatorProject } from "../type";

export const OUT_OF_ORDER: ExcavatorProject = {
  name: "Out of Order",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      // Must be on the quest
      if (questStep("questEspOutOfOrder") < 0) return null;
      // Must be end of battle
      if (currentRound() !== 0) return null;
      // Must be wearing the wristwatch
      if (equippedAmount($item`GPS-tracking wristwatch`) < 1) return null;
      // Must be in the jungle
      if (myLocation() !== $location`The Deep Dark Jungle`) return null;
      const beeps = page.match(/Your GPS tracker beeps ([0-9]+) times as it zeroes in on your quarry/);
      if (!beeps) return null;
      return {
        beeps: beeps[1],
        initiative: numericModifier($modifier`Initiative`),
      };
    },
  },
};

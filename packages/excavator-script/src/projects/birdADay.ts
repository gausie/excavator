/* @author gausie
 * Determine the relationship between Blessing of the Bird modifiers and the day seed
 */
import { numericModifier } from "kolmafia";
import { $effect } from "libram";

import { ExcavatorProject } from "../type";
import { getDaySeed } from "../utils/game";

const BIRD_A_DAY_MODIFIERS = {
  stat: ["Muscle Percent", "Mysticaliy Percent", "Moxie Percent"],
  element: [
    "Cold Resistance",
    "Hot Resistance",
    "Sleaze Resistance",
    "Spooky Resistance",
    "Stench Resistance",
  ],
  attribute: [
    "Item Drop",
    "Meat Drop",
    "Monster Level",
    "Combat Rate",
    "Initiative",
    "Experience",
  ],
  bonus: ["HP Regen Min", "Weapon Damage", "Damage Absorption", "MP Regen Min"],
};

const BLESSING = $effect`Blessing of the Bird`;

function getBlessingModifiers() {
  return Object.entries(BIRD_A_DAY_MODIFIERS).reduce(
    (data, [type, mods]) => {
      const mod = mods.find((m) => numericModifier(BLESSING, m) !== 0);
      return {
        ...data,
        [type]: mod || "",
        [`${type}_value`]: mod ? String(numericModifier(BLESSING, mod)) : "",
      };
    },
    {} as Record<string, string>,
  );
}

export const BIRD_A_DAY: ExcavatorProject = {
  name: "Bird-a-Day",
  hooks: {
    CONSUME_REUSABLE: (itemName: string, page: string) => {
      if (itemName !== "Bird-a-Day calendar") return null;
      if (page.includes("You already read about today's bird.")) return null;

      return {
        ...getBlessingModifiers(),
        ...getDaySeed(),
      };
    },
  },
};

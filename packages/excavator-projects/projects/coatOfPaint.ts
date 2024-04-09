/**
 * @author Phillammon
 * Determine the relationship between Fresh Coat of Paint modifiers and the day seed
 */
import { Item, getProperty, numericModifier, sessionStorage } from "kolmafia";

import { ExcavatorProject } from "../type";
import { getDaySeed, getDifficultySeed } from "../utils";

const COAT_OF_PAINT_MODIFIERS = {
  stat_experience: [
    "Muscle Experience",
    "Mysticality Experience",
    "Moxie Experience",
  ],
  resist_element: [
    "Cold Resistance",
    "Hot Resistance",
    "Sleaze Resistance",
    "Spooky Resistance",
    "Stench Resistance",
  ],
  damage_element: [
    "Cold Damage",
    "Hot Damage",
    "Sleaze Damage",
    "Spooky Damage",
    "Stench Damage",
  ],
};

const COAT_BONUS_REGEX =
  /Spells<\/font><br>(.+?)<\/font><br>Enchantments are different every day<\/font>/;

function getPaintModifiers(page: string) {
  const paintMods = Object.entries(COAT_OF_PAINT_MODIFIERS).reduce(
    (data, [type, mods]) => {
      const mod = mods.find(
        (m) => numericModifier(Item.get("fresh coat of paint"), m) !== 0,
      );
      return {
        ...data,
        [type]: mod || "",
        [`${type}_value`]: mod
          ? String(numericModifier(Item.get("fresh coat of paint"), mod))
          : "",
      };
    },
    {} as Record<string, string>,
  );

  const bonus = page.match(COAT_BONUS_REGEX);

  if (bonus) paintMods.bonus = bonus[1];

  return paintMods;
}

export const COAT_OF_PAINT: ExcavatorProject = {
  name: "Fresh Coat of Paint",
  hooks: {
    DESC_ITEM: (itemName: string, page: string) => {
      if (itemName !== Item.get("fresh coat of paint").name) return null;
      const mod = getProperty("_coatOfPaintModifier");
      if (mod === "") return null;

      // Avoid sending the same data multiple times per session
      if (sessionStorage.getItem("reportedCoatOfPaintMod") === mod) return null;
      sessionStorage.setItem("reportedCoatOfPaintMod", mod);

      return {
        ...getPaintModifiers(page),
        ...getDaySeed(),
        ...getDifficultySeed(),
      };
    },
  },
};

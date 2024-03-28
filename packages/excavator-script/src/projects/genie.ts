/**
 * @author gausie
 * Determine which monsters and effects can be fought/acquired with the Genie.
 */
import { Effect, Monster, toEffect, toMonster } from "kolmafia";

import { ExcavatorProject } from "../type";

function spadeGenie(page: string) {
  // Check page validity
  if (!page.includes("<b>Results:</b>")) return null;

  // Find our wish or bail out
  const wish = page.match(/You announce, "I wish (.*?)"</)?.[1]?.toLowerCase();

  if (!wish) return null;

  // Determine if this was a success
  const success = !page.includes("<br />You could try, ");

  const fightWished = wish.match(
    /(?:(?:to fight|i (?:was|were) fighting) (?:a )?)(.*)/,
  );
  // This will match fights, but is checked afterwards
  const effectWished = wish.match(
    /(?:to be|i (?:was|were)) (?!big|a baller|rich|a little bit taller)(.*)/,
  );

  if (fightWished) {
    //  Determine wishability for fight
    const monster = toMonster(fightWished[1]);

    if (monster === Monster.none) return null;

    const wishable = !monster.boss && monster.copyable;

    if (wishable === success) return null;

    return {
      success,
      type: "monster",
      value: monster.name,
    };
  } else if (effectWished) {
    // Determine wishability for effect
    const effect = toEffect(effectWished[1]);

    if (effect === Effect.none) return null;

    const wishable = !effect.attributes.includes("nohookah");

    if (wishable === success) return null;

    return {
      success,
      type: "effect",
      value: effect.name,
    };
  }

  return null;
}

export const GENIE: ExcavatorProject = {
  name: "Genie",
  hooks: {
    CHOICE_VISIT: (choice: string, page: string) => {
      if (choice !== "1267") return null;
      return spadeGenie(page);
    },
    CHOICE: (url: string, page: string) => {
      if (!url.includes("whichchoice=1267")) return null;
      return spadeGenie(page);
    },
  },
};

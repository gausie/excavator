/**
 * @author midgleyc
 * Determine difficulty level of zones autumnaton is sent to.
 */
import { itemAmount, Location, sessionStorage, toLocation } from "kolmafia";
import { $items, get } from "libram";

import { ExcavatorProject } from "../type";

const UPGRADE_TO_LOCATION_DETAILS = {
  "energy-absorptive hat": "low outdoor",
  "high performance right arm": "mid outdoor",
  "vision extender": "high outdoor",
  "enhanced left arm": "low indoor",
  "high speed right leg": "mid indoor",
  "radar dish": "high indoor",
  "upgraded left leg": "low underground",
  "collection prow": "mid underground",
  "dual exhaust": "high underground",
} as Record<string, string>;

const MELTABLE_TO_LOCATION_DETAILS = {
  "autumn debris shield": "mid outdoor",
  "autumn leaf pendant": "high outdoor",
  "autumn sweater-weather sweater": "low underground",
} as Record<string, string>;

const ITEM_TO_LOCATION_DETAILS = {
  "autumn leaf": "low outdoor",
  "AutumnFest Ale": "low indoor",
  "autumn-spice donut": "mid indoor",
  "autumn breeze": "high indoor",
  "autumn sweater-weather sweater": "low underground",
  "autumn dollar": "mid underground",
  "autumn years wisdom": "high underground",
} as Record<string, string>;

const getLocationDetails = (location: Location) =>
  `${location.difficultyLevel} ${location.environment}`;

function checkUpgrade(location: Location, page: string) {
  const upgrade = page.match(
    /Your autumn-aton also found an? (.+) to upgrade itself./,
  )?.[1];
  if (!upgrade) return null;
  const expected = getLocationDetails(location);
  const actual = UPGRADE_TO_LOCATION_DETAILS[upgrade];

  if (actual === expected) return null;

  return {
    location: location.toString(),
    estimate: actual,
    evidence: `Upgrade ${upgrade}`,
  };
}

function checkItem(location: Location, page: string) {
  const expected = getLocationDetails(location);

  const meltable = Object.keys(MELTABLE_TO_LOCATION_DETAILS).find((m) =>
    page.includes(`You acquire an item: <b>${m}`),
  );

  // If user received meltables, location is known
  if (meltable) {
    const actual = MELTABLE_TO_LOCATION_DETAILS[meltable];
    if (actual === expected) return null;
    return {
      location: location.toString(),
      estimate: actual,
      evidence: `Item: ${meltable}`,
    };
  }

  // If user has meltables, can't be sure as some Mafia envs are wrong
  if (
    $items`autumn debris shield, autumn leaf pendant, autumn sweater-weather sweater`
      .map((i) => itemAmount(i))
      .some((q) => q > 0)
  )
    return null;

  // user has no meltables
  const acquired = page.match(
    /You acquire an item: <b>([Aa]utumn(?!aton)[^<]+)<\/b>/,
  )?.[1];

  if (!acquired) return null;

  const actual = ITEM_TO_LOCATION_DETAILS[acquired];

  if (actual === expected) return null;

  return {
    location: location.toString(),
    estimate: actual,
    evidence: `Item: {acquired}`,
  };
}

function endQuest(locationName: string, page: string) {
  const location = toLocation(locationName);
  return checkUpgrade(location, page) || checkItem(location, page);
}

export const AUTUMNATON: ExcavatorProject = {
  name: "Autumnaton",
  hooks: {
    COMBAT_ROUND: (meta: string, page: string) => {
      const location = get("autumnatonQuestLocation");
      if (location) {
        sessionStorage.setItem("lastQuestLocation", location.toString());
      }

      // If the quest is done, the autumn-aton returns
      if (!page.includes("You acquire an item: <b>autumn-aton")) return null;

      const lastQuestLocation = sessionStorage.getItem("lastQuestLocation");

      // Exit if we don't know where the autumn-aton was sent
      if (!lastQuestLocation) {
        return null;
      }

      sessionStorage.removeItem("lastQuestLocation");

      return endQuest(lastQuestLocation, page);
    },
  },
};

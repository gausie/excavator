/**
 * @author rinn
 * Determine the relationship between Chateau Mantegna Continental Juice Bar potions and the day seed
 */
import "core-js/modules/es.string.match-all";
import { ExcavatorProject } from "../type";
import { getDaySeed } from "../utils/game";

export const JUICE_BAR: ExcavatorProject = {
  name: "Continental Juice Bar",
  hooks: {
    PLACE: (url: string, page: string) => {
      // place.php?whichplace=chateau&action=chateau_desk or
      // place.php?whichplace=chateau&action=chateau_desk2
      if (!url.includes("whichplace=chateau&action=chateau_desk")) return null;

      // Verify this page is the juice bar
      if (!page.includes("survey the array of exotic juices")) return null;

      // Extract the items from the page manually
      // extractItems() returns an item -> count map that doesn't maintain order so we can't use it
      const created = [...page.matchAll(/You acquire an item: <b>(.*?)<\/b>/g)];

      return {
        ...created.reduce(
          (acc, match, i) => ({ ...acc, [`item${i}`]: match[1] }),
          {} as Record<string, string>,
        ),
        ...getDaySeed(),
      };
    },
  },
};

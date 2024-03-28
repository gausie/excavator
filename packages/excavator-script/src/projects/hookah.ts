/**
 * @author gausie
 * Record instances of an effect obtained through a hookah-like mechanic that KoLmafia thinks shouldn't be possible.
 */
import { currentRound, descToEffect, Effect, equippedAmount } from "kolmafia";
import { $item, get, Horsery } from "libram";

import { ExcavatorProject } from "../type";

/**
 * Returns the next effect gained after a given event trigger text
 */
function extractEffectFromEvent(page: string, eventTriggerText: string) {
  if (!page.includes(eventTriggerText)) return Effect.none;

  const descid = page.match(
    new RegExp(
      `${eventTriggerText}.*?<center><table><tr><td><img .*? onClick='eff\\("(.*?)"\\);' width=30 height=30 alt="(.*?)" title=`,
    ),
  )?.[1];

  if (!descid) return Effect.none;

  return descToEffect(descid);
}

/**
 * Return whether this effect is considered obtainable via hookah by existing mafia data
 */
function isHookahable(effect: Effect) {
  if (effect.quality !== "good") return false;
  if (effect.attributes.includes("nohookah")) return false;
  return true;
}

/**
 * Check an effect for a given hookah-like source and event trigger text, and spade the data if necessary
 */
function checkHookahSource(
  page: string,
  source: string,
  eventTriggerText: string,
) {
  const effect = extractEffectFromEvent(page, eventTriggerText);

  if (effect === Effect.none || isHookahable(effect)) return null;

  // If we get here, we have something to report
  return {
    source,
    effect: effect.toString(),
  };
}

export const HOOKAH: ExcavatorProject = {
  name: "Hookah",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      switch (currentRound()) {
        // End of battle
        case 0: {
          // Enhanced signal receiver is an off-hand item that gives 2-11 adventures of a hookahable effect
          if (equippedAmount($item`enhanced signal receiver`) > 0) {
            return checkHookahSource(
              page,
              "enhanced signal receiver",
              "Your signal receiver pipes up:",
            );
          }
          // The crazy horse (acquired from The Horsery) is a slotless resource that gives 5 adventures of a hookahable effect
          if (Horsery.current() === "crazy" && get("_horseryCrazyName")) {
            return checkHookahSource(
              page,
              "crazy horse",
              get("_horseryCrazyName"),
            );
          }
          return null;
        }
        // Start of battle
        case 1: {
          // The ittah bittah hookah is a familiar equip that gives 6 adventures of a hookahable effect
          if (equippedAmount($item`ittah bittah hookah`) > 0) {
            return checkHookahSource(
              page,
              "ittah bittha hookah",
              "takes a pull on the hookah",
            );
          }
          return null;
        }
        default:
          return null;
      }
    },
  },
};

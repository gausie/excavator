import {
  canInteract,
  gamedayToInt,
  inHardcore,
  moonLight,
  moonPhase,
  myClass,
  myDaycount,
  myPath,
  Path,
} from "kolmafia";

export function getDaySeed() {
  return {
    daycount: myDaycount(),
    class: myClass().id,
    path: myPath().id,
  };
}

export function getGamedaySeed() {
  return {
    gameday: gamedayToInt(),
    moonlight: moonLight(),
    moonphase: moonPhase(),
  };
}

export function getDifficulty() {
  if (myPath() !== Path.none) return "Normal";
  if (!canInteract()) return "Normal (Ronin)";
  if (inHardcore()) return "Hardcore";
  return "Casual";
}

export function getDifficultySeed() {
  return {
    difficulty: getDifficulty(),
  };
}

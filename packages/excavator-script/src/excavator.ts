import { projects } from "./projects";
import { Hooks } from "./type";
import { sendSpadingData } from "./utils/spading";

function tupleNotNull<A, B>(
  value: readonly [A, B | null],
): value is readonly [A, B] {
  return value[1] !== null;
}

function main(event: keyof Hooks, meta: string, page: string) {
  projects
    .filter(({ hooks }) => event in hooks)
    .map(({ name, hooks }) => [name, hooks[event]!(meta, page)] as const)
    .filter(tupleNotNull)
    .forEach(([name, data]) => {
      // Projects are permitted to send a single or multiple data points at a time
      (Array.isArray(data) ? data : [data]).forEach((d) => {
        sendSpadingData(name, d);
      });
    });
}

module.exports.main = main;

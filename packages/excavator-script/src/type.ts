export type ExcavatorData = Record<string, string | number | boolean>;

type CallbackResult = ExcavatorData | ExcavatorData[] | null;

export type Hooks = {
  CHOICE: (url: string, page: string) => CallbackResult;
  CHOICE_VISIT: (choice: string, page: string) => CallbackResult;
  CONSUME_REUSABLE: (itemName: string, page: string) => CallbackResult;
  COMBAT_ROUND: (encounter: string, page: string) => CallbackResult;
  DESC_ITEM: (itemName: string, page: string) => CallbackResult;
  PLACE: (url: string, page: string) => CallbackResult;
  PVP: (url: string, page: string) => CallbackResult;
};

export type ExcavatorProject = {
  name: string;
  hooks: Partial<Hooks>;
};

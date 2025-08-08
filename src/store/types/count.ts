export type CountState = {
  count: number;
};

export type CountActions = {
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
  reset: () => void;
};

export type CountStore = CountState & CountActions;

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CountStore } from "../types";

export const useCountStore = create<CountStore>()(
  devtools(
    (set) => ({
      // State
      count: 0,

      // Actions
      increment: (qty: number) =>
        set(
          (state) => ({ count: state.count + qty }),
          false,
          "count/increment",
        ),

      decrement: (qty: number) =>
        set(
          (state) => ({ count: state.count - qty }),
          false,
          "count/decrement",
        ),

      reset: () => set({ count: 0 }, false, "count/reset"),
    }),
    {
      name: "count-store",
    },
  ),
);

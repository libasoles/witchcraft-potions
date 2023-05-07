import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { potionsSlice } from "./store.potions";
import type { PotionSlice } from "./store.potions";

export type Store = PotionSlice;
export type Mutators = [["zustand/immer", never]];

export const usePotionStore = create<Store, Mutators>(
  immer((...args) => potionsSlice(...args))
);

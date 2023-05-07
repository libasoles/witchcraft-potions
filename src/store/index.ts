import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { minMaxAllowedQuantities } from "@/config";
import type { PotionSlice, Store, Mutators } from "./store.types";

const initialState = {
  red: 0,
  yellow: 0,
  blue: 0,
  green: 0,
  gray: 0,
};

const [min, max] = minMaxAllowedQuantities;

function constrain(value: number) {
  return Math.min(Math.max(value, min), max);
}

const potionsSlice: PotionSlice = (set, get) => ({
  potions: initialState,
  update: (type, quantity) =>
    set((draft) => {
      const limitedValue = constrain(quantity);

      draft.potions[type] = limitedValue;
    }),
  isAnyPotionSelected: () => {
    return Object.values(get().potions).some((potion) => potion > 0);
  },
});

export const usePotionStore = create<Store, Mutators>(
  immer((...args) => potionsSlice(...args))
);

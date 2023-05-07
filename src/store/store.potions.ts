import { StateCreator } from "zustand";
import { minMaxAllowedQuantities } from "@/config";
import type { Mutators, Store } from ".";
import type { PotionType } from "@/types";

type PotionState = {
  potions: {
    readonly [key in PotionType]: number;
  };
};

type PotionActions = {
  update: (type: PotionType, amount: number) => void;
  isAnyPotionSelected: () => boolean;
};

export type PotionSlice = PotionState & PotionActions;

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

type CreateSlice = StateCreator<Store, Mutators, [], PotionSlice>;

export const potionsSlice: CreateSlice = (set, get) => ({
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

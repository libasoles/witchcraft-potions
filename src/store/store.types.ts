import { StateCreator } from "zustand";
import type { PotionType } from "@/types";

export type PotionState = {
  potions: {
    readonly [key in PotionType]: number;
  };
};

export type PotionActions = {
  update: (type: PotionType, amount: number) => void;
  isAnyPotionSelected: () => boolean;
};

export type Store = PotionState & PotionActions;
export type Mutators = [["zustand/immer", never]];

export type PotionSlice = StateCreator<Store, Mutators, [], Store>;

export type Update = (type: PotionType, amount: number) => void;
export type PotionQuantifier = [number, Update];

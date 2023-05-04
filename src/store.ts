import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PotionType } from "./types";

type UpdateQuantity = (amount: number) => void;

type PotionState = {
  potions: {
    readonly [key in PotionType]: number;
  };
} & {
  update: (type: PotionType) => UpdateQuantity;
};

type Store = PotionState;
type Mutators = [["zustand/immer", never]];

const initialState = {
  red: 0,
  yellow: 0,
  blue: 0,
  green: 0,
  gray: 0,
};

const usePotionStore = create<Store, Mutators>(
  immer((set) => ({
    potions: { ...initialState },
    update: (type) => (amount) =>
      set((draft) => {
        draft.potions[type] = amount;
      }),
  }))
);

type PotionQuantifier = [number, UpdateQuantity];

export const usePotionQuantifier = (type: PotionType): PotionQuantifier => {
  const store = usePotionStore();
  const amount = store.potions[type];
  const update = store.update(type);

  return [amount, update];
};

export const usePotionQuantifiers = () =>
  usePotionStore((store) => ({ ...store.potions }));

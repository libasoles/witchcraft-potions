import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PotionType } from "./types";

type UpdateQuantity = (amount: number) => void;

type PotionState = {
  potions: {
    readonly [key in PotionType]: number;
  };
  update: (type: PotionType) => UpdateQuantity;
  isAnyPotionSelected: () => boolean;
};

type Store = PotionState;
type Mutators = [["zustand/immer", never]];

type PotionSlice = StateCreator<Store, Mutators, [], PotionState>;

const initialState = {
  red: 0,
  yellow: 0,
  blue: 0,
  green: 0,
  gray: 0,
};

export const potionsSlice: PotionSlice = (set, get) => ({
  potions: { ...initialState },
  update: (type) => (amount) =>
    set((draft) => {
      draft.potions[type] = amount;
    }),
  isAnyPotionSelected: () => {
    return Object.values(get().potions).some((potion) => potion > 0);
  },
});

const usePotionStore = create<Store, Mutators>(
  immer((...args) => potionsSlice(...args))
);

type PotionQuantifier = [number, UpdateQuantity];

export const usePotionQuantifier = (type: PotionType): PotionQuantifier => {
  const store = usePotionStore();
  const amount = store.potions[type];
  const update = store.update(type);

  return [amount, update];
};

export const usePotionQuantifiers = () => {
  const store = usePotionStore();

  return {
    quantifiers: { ...store.potions },
    isAnyPotionSelected: store.isAnyPotionSelected,
  };
};

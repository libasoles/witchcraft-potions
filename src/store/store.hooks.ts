import { shallow } from "zustand/shallow";
import { usePotionStore } from ".";
import type { PotionType } from "@/types";
import type { PotionQuantifier } from "./store.types";

export const usePotionQuantifier = (type: PotionType): PotionQuantifier => {
  return usePotionStore(({ potions, update }) => {
    const potion = potions[type];

    return [potion, update];
  }, shallow);
};

export const usePotionQuantifiers = () =>
  usePotionStore(({ potions, isAnyPotionSelected }) => {
    return {
      quantifiers: potions,
      isAnyPotionSelected,
    };
  });

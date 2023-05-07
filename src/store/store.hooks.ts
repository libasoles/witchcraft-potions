import { shallow } from "zustand/shallow";
import { usePotionStore } from ".";
import type { PotionType } from "@/types";

export type Update = (type: PotionType, amount: number) => void;
export type PotionQuantifier = [number, Update];

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

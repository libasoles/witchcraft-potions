import { damagePercentByPotionQuantity } from "./config";

export type PotionType = "red" | "blue" | "green" | "yellow" | "gray";

export type Potion = {
  id: PotionType;
  name: string;
  image: string;
};

export type Potions = Potion[];

export type NumberOfPotions = keyof typeof damagePercentByPotionQuantity;

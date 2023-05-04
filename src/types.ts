export type PotionType = "red" | "blue" | "green" | "yellow" | "gray";

export type Potion = {
  id: PotionType;
  name: string;
  image: string;
};

export type Potions = Potion[];

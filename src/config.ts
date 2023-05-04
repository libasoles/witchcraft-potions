import { Potions } from "./types";

export const potions: Potions = [
  { id: "red", name: "Red Potion", image: "redPotion.png" },
  { id: "blue", name: "Blue Potion", image: "bluePotion.png" },
  { id: "green", name: "Green Potion", image: "greenPotion.png" },
  { id: "yellow", name: "Yellow Potion", image: "yellowPotion.png" },
  { id: "gray", name: "Gray Potion", image: "grayPotion.png" },
];

export const damagePercentByPotionQuantity = {
  1: 3,
  2: 5,
  3: 10,
  4: 20,
  5: 25,
};

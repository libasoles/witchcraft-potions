import { damagePercentByPotionQuantity } from "@/config";
import type { NumberOfPotions } from "@/types";

type Attacks = NumberOfPotions[];

export function calculateDamage(quantifiers: number[]) {
  const attacks = simulate(quantifiers) as Attacks;

  const total = calculateTotalDamage(attacks);

  return {
    attacks,
    total,
  };
}

function simulate(quantifiers: number[]): Attacks {
  const availablePotions = onlyAvailablePotions(quantifiers);
  const availableQuantity = availablePotions.length;

  if (availableQuantity === 0) return [];

  if (availableQuantity === 2) {
    return sum([1, 1], simulate(reduceAllPotionsInOne(availablePotions)));
  }

  const attackUsingAllPotions = [availableQuantity] as Attacks;
  const subsequentsAttacks = simulate(reduceAllPotionsInOne(availablePotions));

  return sum(attackUsingAllPotions, subsequentsAttacks);
}

function onlyAvailablePotions(quantifiers: number[]) {
  return quantifiers.filter((quantity) => quantity > 0);
}

function reduceAllPotionsInOne(quantifiers: number[]) {
  return quantifiers.map((quantity) => quantity - 1);
}

function sum(someAttacks: Attacks, otherAttacks: Attacks) {
  return someAttacks.concat(otherAttacks);
}

function calculateTotalDamage(attacks: Attacks) {
  return attacks.reduce((total, attack) => {
    const damagePerPotionCombination = damagePercentByPotionQuantity[attack];
    return total + damagePerPotionCombination;
  }, 0);
}

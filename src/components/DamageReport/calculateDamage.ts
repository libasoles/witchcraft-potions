import { damagePercentByPotionQuantity } from "@/config";
import type { NumberOfPotions } from "@/types";

type Strategy = NumberOfPotions[];

export function calculateDamage(quantifiers: number[]) {
  let availablePotions = quantifiers;
  let total = 0;

  const attacks: Strategy[] = [];

  while (availablePotions.some(isNotEmpty)) {
    const attack = simulate(availablePotions) as Strategy;
    attacks.push(attack);

    total += calculateTotalDamage(attack);

    availablePotions = reduceAllPotionsInOne(availablePotions);
  }

  return {
    attacks: attacks.flatMap((attack) => attack),
    total,
  };
}

const isNotEmpty = (quantity: number) => quantity > 0;

function simulate(quantifiers: number[]): Strategy {
  const availablePotions = onlyAvailablePotions(quantifiers);
  const availableQuantity = availablePotions.length;

  if (availableQuantity === 0) return [];
  if (availableQuantity === 1) return [1];

  const attackUsingAllPotions = [availableQuantity] as Strategy;

  const possibleAttacks = tryPossibleAttacks(availableQuantity);

  return [attackUsingAllPotions, ...possibleAttacks].reduce(bestAttack);
}

function onlyAvailablePotions(quantifiers: number[]) {
  return quantifiers.filter((quantity) => quantity > 0);
}

function reduceAllPotionsInOne(quantifiers: number[]) {
  return quantifiers.map((quantity) => quantity - 1);
}

function combine(someAttacks: Strategy, otherAttacks: Strategy) {
  return someAttacks.concat(otherAttacks);
}

function range(start: number, stop: number) {
  const length = stop - start;
  const fill = (x: number, i: number) => start + i;
  return Array.from({ length }, fill);
}

function calculateTotalDamage(attacks: Strategy) {
  return attacks.reduce((total, attack) => {
    const damagePerPotionCombination = damagePercentByPotionQuantity[attack];
    return total + damagePerPotionCombination;
  }, 0);
}

function tryPossibleAttacks(numberOfPotions: number) {
  return range(1, numberOfPotions).map((somePotions) => {
    const restOfPotions = setOfPotions(numberOfPotions - somePotions);

    const attackwithSomePotions = [somePotions as NumberOfPotions];
    const bestAttackWithRestOfPotions = simulate(restOfPotions);

    const possibleAttack = combine(
      attackwithSomePotions,
      bestAttackWithRestOfPotions
    );

    return possibleAttack;
  });
}

function bestAttack(
  anAttackStrategy: Strategy,
  anotherAttackStrategy: Strategy
) {
  return calculateTotalDamage(anAttackStrategy) >
    calculateTotalDamage(anotherAttackStrategy)
    ? anAttackStrategy
    : anotherAttackStrategy;
}

function setOfPotions(amount: number) {
  return Array(amount).fill(1);
}

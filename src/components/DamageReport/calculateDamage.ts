import { damagePercentByPotionQuantity } from "@/config";
import type { NumberOfPotions } from "@/types";

type Strategy = NumberOfPotions[];

export function calculateDamage(potions: number[]) {
  const attacks = merge(simulateAttacksWith(potions));
  const total = calculateTotalDamage(attacks);

  return {
    attacks,
    total,
  };
}

function simulateAttacksWith(availablePotions: number[]): Strategy[] {
  const attack = bestAttackWith(availablePotions) as Strategy;

  const remainingPotions = reduceAllPotionsInOne(availablePotions);

  if (remainingPotions.some(isNotEmpty)) {
    const subsequentAttacks = simulateAttacksWith(remainingPotions);

    return [attack, ...subsequentAttacks];
  }

  return [attack];
}

const isNotEmpty = (quantity: number) => quantity > 0;

const noAttack = [] as Strategy;
const singlePotionAttack = [1] as Strategy;
const attackWith = (potions: number) => [potions] as Strategy;

function bestAttackWith(potions: number[]): Strategy {
  const availablePotions = onlyAvailable(potions);
  const availableQuantity = availablePotions.length;

  if (availableQuantity === 0) return noAttack;
  if (availableQuantity === 1) return singlePotionAttack;

  const attackUsingAllPotions = attackWith(availableQuantity);
  const otherPossibleAttacks = tryPossibleAttackCombinations(availableQuantity);

  return [attackUsingAllPotions, ...otherPossibleAttacks].reduce(bestAttack);
}

function onlyAvailable(potions: number[]) {
  return potions.filter((quantity) => quantity > 0);
}

function reduceAllPotionsInOne(potions: number[]) {
  return potions.map((quantity) => quantity - 1);
}

function combine(someAttacks: Strategy, otherAttacks: Strategy) {
  return someAttacks.concat(otherAttacks);
}

function calculateTotalDamage(attacks: Strategy) {
  const initialDamage = 0;

  return attacks.reduce(
    (total, quantity) => total + damagePercentByPotionQuantity[quantity],
    initialDamage
  );
}

function tryPossibleAttackCombinations(numberOfPotions: number) {
  const numberedPotions = range(1, numberOfPotions);

  return numberedPotions.map((somePotions) => {
    const attackWithSomePotions = attackWith(somePotions);

    const restOfPotions = setOfPotions(numberOfPotions - somePotions);
    const bestAttackWithRestOfPotions = bestAttackWith(restOfPotions);

    const possibleStrategy = combine(
      attackWithSomePotions,
      bestAttackWithRestOfPotions
    );

    return possibleStrategy;
  });
}

function range(start: number, stop: number) {
  const length = stop - start;
  const fill = (_: number, index: number) => start + index;

  return Array.from({ length }, fill);
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

function merge(attacks: Strategy[]) {
  return attacks.flatMap((attack) => attack);
}

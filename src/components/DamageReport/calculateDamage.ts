import { damagePercentByPotionQuantity } from "@/config";
import { AmountOfPotions } from "@/types";

type Attack = {
  attacks: number[]; // rename to damages
  total: number;
};

const noAttack = {
  attacks: [],
  total: 0,
};

const attackWithOnePotion = {
  attacks: [1], // TODO: semantic name for this number?
  total: damagePercentByPotionQuantity[1],
};

export function calculateDamage(quantifiers: number[]): Attack {
  const availablePotions = onlyAvailablePotions(quantifiers);

  if (availablePotions.length === 0) return noAttack;

  const [damageUsingAllPotions, remainingPotions] =
    attackUsingAllPotions(availablePotions);

  if (availablePotions.length === 1)
    return sum(damageUsingAllPotions, calculateDamage(remainingPotions));

  const firstPlusRestCombination = sum(
    attackWithOnePotion,
    calculateDamage(potionsMinusOne(availablePotions))
  );

  const bestStrategy = max(damageUsingAllPotions, firstPlusRestCombination);

  return sum(bestStrategy, calculateDamage(remainingPotions));
}

function onlyAvailablePotions(quantifiers: number[]) {
  return quantifiers.filter((quantity) => quantity > 0);
}

function attackUsingAllPotions(quantifiers: number[]): [Attack, number[]] {
  const attacks = [quantifiers.length];
  const total =
    damagePercentByPotionQuantity[quantifiers.length as AmountOfPotions];

  const attack = {
    attacks,
    total,
  };

  return [attack, reduceAllPotionsInOne(quantifiers)];
}

function potionsMinusOne(quantifiers: number[]) {
  const first = quantifiers.shift() as number;

  return [first - 1, ...quantifiers];
}

function reduceAllPotionsInOne(quantifiers: number[]) {
  return quantifiers.map((quantity) => quantity - 1);
}

function sum(attack1: Attack, attack2: Attack) {
  return {
    attacks: attack1.attacks.concat(attack2.attacks),
    total: attack1.total + attack2.total,
  };
}

function max(attack1: Attack, attack2: Attack) {
  return attack1.total > attack2.total ? attack1 : attack2;
}

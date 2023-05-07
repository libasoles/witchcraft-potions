import { NumberOfPotions } from "@/types";
import { calculateDamage } from "./calculateDamage";

describe("simulate attacks", () => {
  it("should return no attack when no potions are available", () => {
    const potions: number[] = [];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([]);
    expect(total).toBe(0);
  });

  it("should return one attack when one potion is available, and damage is 3%", () => {
    const potions = [1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([1]);
    expect(total).toBe(3);
  });

  it("should return two attacks when two potions are available, and damage is 6%", () => {
    const potions = [1, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([1, 1]);
    expect(total).toBe(6);
  });

  it("should return only one attack when three potions are available, and damage is 10%", () => {
    const potions = [1, 1, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([3]);
    expect(total).toBe(10);
  });

  it("should return only one attack when four potions are available, and damage is 20%", () => {
    const potions = [1, 1, 1, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([4]);
    expect(total).toBe(20);
  });

  it("should return only one attack when five potions are available, and damage is 25%", () => {
    const potions = [1, 1, 1, 1, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([5]);
    expect(total).toBe(25);
  });

  it("returns two attacks when using the same potion twice, and damage is 6%", () => {
    const potions = [2];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([1, 1]);
    expect(total).toBe(6);
  });

  it("returns three attacks when using the same potion twice, and one more, and damage is 9%", () => {
    const potions = [2, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([1, 1, 1]);

    expect(total).toBe(9);
  });

  it("returns two attacks when using the same potion twice, and two more, and damage is 13%", () => {
    const potions = [2, 1, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([3, 1]);

    expect(total).toBe(13);
  });

  it("returns three attacks when using two potions twice, plus one of each of the rest, and damage is 31%", () => {
    const potions = [2, 2, 1, 1, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([5, 1, 1]);

    expect(total).toBe(31);
  });

  it("returns two attacks when using three potions twice, plus one of each of the rest, and damage is 35%", () => {
    const potions = [2, 2, 2, 1, 1];

    const { attacks, total } = calculateDamage(potions);

    expect(attacks).toEqual([5, 3]);

    expect(total).toBe(35);
  });
});

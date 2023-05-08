# Witchcraft Simulator

by: Guillermo Perez

## Description

A witch has entered a shop and has bought a certain number of potions to go to kill a strige.

The challenge is to carry out an algorithm that helps the witch to calculate the most optimal attacks for a given amount of potions, regardless of the number of attacks and combinations he makes as long as:

- You can only combine potions of different colors.
- The result must be the combinations that cause the most damage.

[![Demo](https://github.com/libasoles/witchcraft-potions/blob/main/public/screenshot.png)](https://voluble-florentine-6c6068.netlify.app/)

Live demo: [https://voluble-florentine.netlify.app/](https://voluble-florentine-6c6068.netlify.app/)

## Technologies

- React (compiled with Next.js)
- Typescript
- Tailwind CSS
- Jest and Testing Library
- Zustand for state management

## Running the code

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run the tests:

```bash
npm run test
```

Coverage report:

![Screenshot](https://github.com/libasoles/witchcraft-potions/blob/main/public/coverage.png)

## Algorithm explained

Though it should explain itself, I'll comment the algorithm in a few words.

But first, keep in mind that this algorithm is a generalized one, and so it's quite more complex than other algorithms that "just do the job". Consider this simpler one (from a previous commit):

[https://github.com/libasoles/witchcraft-potions/.../calculateDamage.ts](https://github.com/libasoles/witchcraft-potions/blob/9a0a867f17f1a01e48e031bb491b658b5eb113a7/src/components/DamageReport/calculateDamage.ts)

It works for the current rules of the game, and that should be ok to deliver (in an agile mindset). But it's not generalized. It's not prepared to deal with changes in the rules. And I thought that I could show off a more generalized algorithm. And that requires more abstraction, and then more semantic efforts.

This more abstract algorithm is separated in these parts, from top down:

*Get a list of attack*s, and *calculate the total damage*.

```javascript
export function calculateDamage(potions: number[]) {
  const attacks = simulateAttacksWith(potions);
  const total = calculateTotalDamage(attacks);

  return {
    attacks,
    total,
  };
}
```

Recursively calculate attacks for a given list of potions.
E.g.: for `availablePotions` being `[1, 2, 2, 1, 1]`, it will calculate the best attack for `[1, 1, 1, 1, 1]` and then the best for the remaining `[1, 1]`

```javascript
function simulateAttacksWith(availablePotions): Strategy[] {
  const attack = bestAttackWith(availablePotions);

  const remainingPotions = reduceAllPotionsInOne(availablePotions);

  if (remainingPotions.some(isNotEmpty)) {
    const subsequentAttacks = simulateAttacksWith(remainingPotions);

    return [attack, ...subsequentAttacks];
  }

  return [attack];
}
```

I'm using recursion to consume the potions. But the base cases are encapsulated in `bestAttackWith` function.

The base cases are:

- when there's *no potions left*, the algorithm returns an empty array (an empty list of attacks)
- when there's *only one potion left*. In that case, the algorithm returns a list with a single potion attack.

Then the algorithm evaluates two possible approaches:

- attack using *all available potions*
- attack *separating the potions in groups* (recursively).

```javascript
function bestAttackWith(potions): Strategy {
  const availablePotions = onlyAvailable(potions);
  const availableQuantity = availablePotions.length;

  if (availableQuantity === 0) return noAttack;
  if (availableQuantity === 1) return singlePotionAttack;

  const attackUsingAllPotions = attackWith(availableQuantity);
  const otherPossibleAttacks = tryPossibleAttackCombinations(availableQuantity);

  return [attackUsingAllPotions, ...otherPossibleAttacks].reduce(bestAttack);
}
```

The combinations are calculated inside `tryPossibleAttackCombinations` function. It will call `bestAttackWith` function, so it can recursively decompose the potions in groups.

It increases the left side of the group and decompose the right side recursively. Like `(1 + 4)`, `(1 + 1 + 3)`, `(1 + 1 + 1 + 2)`, `(1 + 1 + 1 + 1 + 1)`. And then the same with `(2 + 3)`, `(2 + 1 + 2)`, `(2 + 1 + 1 + 1)`, etc.

```javascript
function tryPossibleAttackCombinations(numberOfPotions) {
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
```

That function just returns all possible attack combinations. Then the previous function will only pick the best one (the strategy causing more damage).

Note that `calculateDamage` function only returns a list of numbers, not messages. Because presentation is not the algorithm's concern. Presentation is a concern of the `DamageReport` component.

Finally, I have to say that the performance of the algorithm is good. I found no need of optimizing it with techniques like *memoization*.

## About the code

I'm using `Next.js` because it's one of the main framework that React documentation recommends. But I'm not actually using many of the features that Next.js provides because this is a small project. I could have used Vite as well.

Entry point is pages folder. There's only one page there, the `Simulator`.

It receives a list of potions, so tests can inject whatever they want. However, typescript constrains the type of potions allowed. They have to be one of 'red', 'blue', etc.

There's a `types.ts` file where you can see the above. It might call your attention that also the number of potions is constrained to be between 1 and 5. That's helpful for the algorithm as it works with a limited number of potions (5) and typescript has to acknowledge that as well.

The store is written with `Zustand`and deserves a few comments. First, I'm using `Immer` so I can pretend I'm mutating state while under the hood Immer is maintaining immutability. If you are not familiar with Zustand, the reducers might look a bit busy but that could be improved as soon as state grows and store separates in slices.

I'm exporting two custom hooks from there and not the store itself. That provides the clients only what they need.

`usePotionQuantifier` works almost like `useState`. It provides the current amount of a given potion, and a mean to update that amount.

You'll see there's a mock for the store inside `__mocks__` folder. That will take care of cleaning up the store after each test run.

Now, a comment about the *components* folder. I create a folder for each component, and inside that folder I put the component itself, the styles, the tests, hooks and whatever is directly related to the component.

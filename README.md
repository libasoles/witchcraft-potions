# Witchcraft simulator

by: Guillermo Perez

## Description

A witch has entered a shop and has bought a certain number of potions to go to kill a strige.

The challenge is to carry out an algorithm that helps the witch to calculate the most optimal attacks for a given amount of potions, regardless of the number of attacks and combinations he makes as long as:

- You can only combine potions of different colors.
- The result must be the combinations that cause the most damage.

![Screenshot](https://github.com/libasoles/witchcraft-potions/blob/main/public/screenshot.png)

## Techonologies

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

## About the code

I'm using `Next.js` because it's one of the main framework that React documentation recommends. But I'm not actually using many of the features that Next.js provides because this is an small project. I could have used Vite as well.

Entry point is pages folder. There's only one page there, the `Simulator`.

It receives a list of potions, so tests can inject whatever they want. However, typescript constrains the type of potions allowed. They have to be one of 'red','blue', etc.

There's a `types.ts` file where you can see the above. It might call your attention that also the number of potions is constrained to be between 1 and 5. That's helpful for the algorithm as it works with a limited number of potions and typescript has to acknowledge that as well.

The store is written with `Zustand`and deserves a few comments. First, I'm using `Immer` so I can pretend I'm mutating state while under the hood Immer is maintaining inmutability. If you are not familiar with Zustand, the reducers might look a bit busy but that could be improved as soon as state grows and store separates in slices.

I'm exporting two custom hooks from there and not the store itself. That provides the clients only what they need.

`usePotionQuantifier` works almost like `useState`. It provides the current amount of a given potion, and a mean to update that amount. Note that I'm _currying_ the update function so the client can pick a quantifier for a given potion instead of dealing with the whole stock.

You'll see there's a mock for the store inside `__mocks__` folder. That will take care of cleaning up the store after each test run.

Now, a comment about the _components_ folder. I create a folder for each component, and inside that folder I put the component itself, the styles, the tests, hooks and whatever is directly related to the component.

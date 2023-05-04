// This file is used to reset all stores after each test run
// reference: https://github.com/pmndrs/zustand/blob/main/docs/guides/testing.md#resetting-state-between-tests-in-react-dom

const { create: actualCreate } = jest.requireActual("zustand");
import { act } from "react-dom/test-utils";

const storeResetFns = new Set();

export const create = (createState) => {
  const store = actualCreate(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

beforeEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
});

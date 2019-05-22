import { ExpensesGetters } from './getters';
import { ExpensesDefaultState, IExpensesState } from './state';

describe('ExpensesGetters', () => {
  let testState: IExpensesState;

  beforeEach(() => {
    testState = ExpensesDefaultState();
  });

  test('it should get the count', () => {
    expect(ExpensesGetters.count(testState)).toBe(0);
  });

  test('it should get increment pending', () => {
    expect(ExpensesGetters.incrementPending(testState)).toBe(false);
  });

  test('it should get decrement pending', () => {
    expect(ExpensesGetters.decrementPending(testState)).toBe(false);
  });
});

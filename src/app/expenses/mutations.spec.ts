import { ExpensesMutations } from './mutations';
import { ExpensesDefaultState, IExpensesState } from './state';

describe('ExpensesMutations', () => {
  let testState: IExpensesState;

  beforeEach(() => {
    testState = ExpensesDefaultState();
  });

  test('it should set the count', () => {
    ExpensesMutations.SET_COUNT(testState, 1337);
    expect(testState.count).toBe(1337);
  });

  test('it should set increment pending', () => {
    ExpensesMutations.SET_INCREMENT_PENDING(testState, true);
    expect(testState.incrementPending).toBe(true);
  });

  test('it should set decrement pending', () => {
    ExpensesMutations.SET_DECREMENT_PENDING(testState, true);
    expect(testState.decrementPending).toBe(true);
  });
});

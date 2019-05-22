import { IExpensesState } from './state';

export interface IExpensesMutations {
  SET_INCREMENT_PENDING(state: IExpensesState, pending: boolean): void;

  SET_DECREMENT_PENDING(state: IExpensesState, pending: boolean): void;

  SET_COUNT(state: IExpensesState, count: number): void;
}

export const ExpensesMutations: IExpensesMutations = {
  SET_INCREMENT_PENDING: (state: IExpensesState, pending: boolean) => {
    state.incrementPending = pending;
  },
  SET_DECREMENT_PENDING: (state: IExpensesState, pending: boolean) => {
    state.decrementPending = pending;
  },
  SET_COUNT: (state: IExpensesState, count: number) => {
    state.count = count;
  },
};

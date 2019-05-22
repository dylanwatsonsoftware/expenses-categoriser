import { IExpensesState } from './state';

export interface IExpensesGetters {
  incrementPending(state: IExpensesState): boolean;
  decrementPending(state: IExpensesState): boolean;
  count(state: IExpensesState): number;
}

export const ExpensesGetters: IExpensesGetters = {
  incrementPending(state: IExpensesState): boolean {
    return state.incrementPending;
  },
  decrementPending(state: IExpensesState): boolean {
    return state.decrementPending;
  },
  count(state: IExpensesState): number {
    return state.count;
  },
};

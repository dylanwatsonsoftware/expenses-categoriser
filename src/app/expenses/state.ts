export interface IExpensesState {
  incrementPending: boolean;
  decrementPending: boolean;
  count: number;
}

export const ExpensesDefaultState = (): IExpensesState => {
  return {
    incrementPending: false,
    decrementPending: false,
    count: 0,
  };
};

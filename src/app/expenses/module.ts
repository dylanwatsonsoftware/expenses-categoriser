import { Module } from 'vuex';
import { IState } from '@/app/state';
import { ExpensesDefaultState, IExpensesState } from './state';
import { ExpensesActions } from './actions';
import { ExpensesGetters } from './getters';
import { ExpensesMutations } from './mutations';

export const ExpensesModule: Module<IExpensesState, IState> = {
  namespaced: true,
  actions: {
    ...ExpensesActions,
  },
  getters: {
    ...ExpensesGetters,
  },
  state: {
    ...ExpensesDefaultState(),
  },
  mutations: {
    ...ExpensesMutations,
  },
};

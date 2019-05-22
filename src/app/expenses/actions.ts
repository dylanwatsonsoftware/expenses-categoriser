import { ActionContext } from 'vuex';
import { IExpensesState } from './state';
import { IState } from '@/app/state';
import { HttpService } from '@/app/shared/services/HttpService/HttpService';

export interface IExpensesResponse {
  count: number;
}

export interface IExpensesActions {
  increment(context: ActionContext<IExpensesState, IState>): Promise<any>;

  decrement(context: ActionContext<IExpensesState, IState>): Promise<any>;
}

export const ExpensesActions: IExpensesActions = {
  async increment({ commit, state }: ActionContext<IExpensesState, IState>) {
    commit('SET_INCREMENT_PENDING', true);

    try {
      const res = await HttpService.put<IExpensesResponse>('/counter/increment', { count: state.count });

      commit('SET_COUNT', res.data.count);
      commit('SET_INCREMENT_PENDING', false);
    } catch (e) {
      commit('SET_INCREMENT_PENDING', false);
      throw new Error(e);
    }
  },
  async decrement({ commit, state }: ActionContext<IExpensesState, IState>) {
    commit('SET_DECREMENT_PENDING', true);

    try {
      const res = await HttpService.put<IExpensesResponse>('/counter/decrement', { count: state.count });

      commit('SET_COUNT', res.data.count);
      commit('SET_DECREMENT_PENDING', false);
    } catch (e) {
      commit('SET_DECREMENT_PENDING', false);
      throw new Error(e);
    }
  },
};

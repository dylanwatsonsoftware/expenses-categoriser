import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { ActionTree, GetterTree, Store } from 'vuex';
import { ExpensesGetters, IExpensesGetters } from '../getters';
import { ExpensesDefaultState, IExpensesState } from '../state';
import { ExpensesActions, IExpensesActions } from '../actions';
import Expenses from './Expenses.vue';
import { i18n } from '@/app/shared/plugins/i18n/i18n';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Expenses.vue', () => {
  let store: Store<IExpensesState>;
  let getters: GetterTree<IExpensesState, IExpensesGetters>;
  let actions: ActionTree<IExpensesState, IExpensesActions>;
  let state: IExpensesState;

  beforeEach(() => {
    getters = {
      ...ExpensesGetters,
    };
    actions = {
      ...ExpensesActions,
      increment: jest.fn(),
      decrement: jest.fn(),
    };
    state = {
      ...ExpensesDefaultState(),
    };

    store = new Vuex.Store({
      modules: {
        expenses: {
          namespaced: true,
          getters,
          actions,
          state,
        },
      },
    } as any);
  });

  test('renders component', () => {
    const wrapper = mount<any>(Expenses, {
      store,
      localVue,
      i18n,
    });

    expect(wrapper.find('h1').text()).toBe('Expenses');
  });

  test('should increment and decrement', () => {
    const wrapper: any = mount<any>(Expenses, {
      store,
      localVue,
      i18n,
    });

    wrapper.vm.increment();
    expect(actions.increment).toHaveBeenCalled();

    wrapper.vm.decrement();
    expect(actions.decrement).toHaveBeenCalled();
  });

  test('dispatches action on the server', () => {
    store.dispatch = jest.fn();

    Expenses.prefetch({ store });

    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(`expenses/increment`);
  });
});

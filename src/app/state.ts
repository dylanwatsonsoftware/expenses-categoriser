import { AppDefaultState, IAppState } from './app/state';
import { AuthDefaultState, IAuthState } from './shared/modules/auth/state';
import { IExpensesState } from './expenses/state';

export interface IState {
  [key: string]: any;

  app?: IAppState;
  auth?: IAuthState;
  expenses?: IExpensesState;
}

export const DefaultState: IState = {
  app: {
    ...AppDefaultState(),
    ...AuthDefaultState(),
  },
};

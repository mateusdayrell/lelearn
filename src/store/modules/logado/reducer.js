import * as types from '../types';

const initialState = {
  LOGADO: false,
};

// eslint-disable-next-line default-param-last
export default function (state = initialState, action) {
  switch (action.type) {
    case types.LOGADO_SUCCESS: {
      console.log('Sucesso');
      const newState = { ...state };
      newState.LOGADO = !newState.LOGADO;
      return newState;
    }

    case types.LOGADO_REQUEST:
      console.log('Fazendo requisição');
      return state;

    case types.LOGADO_FAILURE:
      console.log('Falha na requisição');
      return state;

    default:
      return state;
  }
}

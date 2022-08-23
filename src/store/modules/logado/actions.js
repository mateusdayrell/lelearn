import * as types from '../types';

export function logadoRequest() {
  return {
    type: types.LOGADO_REQUEST,
  };
}

export function logadoSuccess() {
  return {
    type: types.LOGADO_SUCCESS,
  };
}

export function logadoFailure() {
  return {
    type: types.LOGADO_FAILURE,
  };
}

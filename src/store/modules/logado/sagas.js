import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import * as actions from './actions';
import * as types from '../types';

const request = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

function* logadoRequest() {
  try {
    yield call(request);
    yield put(actions.logadoSuccess());
  } catch {
    toast.error('Erro redux');
    yield put(actions.logadoFailure());
  }
}

export default all([takeLatest(types.LOGADO_REQUEST, logadoRequest)]);

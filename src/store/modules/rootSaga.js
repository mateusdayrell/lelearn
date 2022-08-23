import { all } from 'redux-saga/effects';

import logado from './logado/sagas';

export default function* rootSaga() {
  return yield all([logado]);
}

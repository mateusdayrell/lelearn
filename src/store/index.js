import { persistStore } from 'redux-persist';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReucer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';
import persisedReducers from './modules/reduxPersist';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  persisedReducers(rootReucer),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;

import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';

export default (reducers) => {
  const persisedReducers = persistReducer(
    {
      key: 'llrn-frontend', // nome da aplicação
      storage,
      whitelist: ['auth'], // chaves do combineReducer do arquivo rootReducer.js
    },
    reducers
  );

  return persisedReducers;
};

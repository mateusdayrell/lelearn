import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';

export default (reducers) => {
  const persisedReducers = persistReducer(
    {
      key: 'REACT-BASE', // nome da aplicação
      storage,
      whitelist: ['logado'], // chaves do combineReducer do arquivo rootReducer.js
    },
    reducers
  );

  return persisedReducers;
};

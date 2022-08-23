import { combineReducers } from 'redux';

import logadoReducer from './logado/reducer';

export default combineReducers({ logado: logadoReducer });

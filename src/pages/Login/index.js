import React from 'react';
import { useDispatch } from 'react-redux/es/exports';
import * as logadoActions from '../../store/modules/logado/actions';

export default function Login() {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();

    dispatch(logadoActions.logadoRequest());
  };

  return (
    <>
      <h1>Login</h1>
      <button type="button" onClick={handleClick}>
        Logar
      </button>
    </>
  );
}

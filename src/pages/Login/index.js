import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { get } from 'lodash';

import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';
import './style.css';

export default function Login(props) {
  const dispatch = useDispatch();

  const prevPath = get(props, 'location.state.prevPath', '/');
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErros = false;

    if (!email) {
      formErros = true;
      toast.info('Digite um e-mail');
    }

    if (!senha) {
      formErros = true;
      toast.info('Digite uma senha');
    }

    if (formErros) return;

    dispatch(actions.loginRequest({ email, senha, prevPath }));
  };

  return (
    <>
      <Loading isLoading={isLoading} />

      <div className="login-container">
        <h1 className='mx-auto font-extrabold text-2xl'>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="senha"
            placeholder="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button className='btn' type="submit">Logar</button>
        </form>
      </div>
    </>
  );
}

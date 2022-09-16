import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

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
      <div className="elipse-1" />
      <div className="green-gradient h-full w-full flex justify-end float">
        <div className="flex flex-col h-min w-min mt-[30vh] mr-[5vw]">
          <h1 className="mx-auto font-extrabold text-2xl text-white">Login</h1>

          <div className="flex flex-col gap-3 w-[40vw] max-w-[350px]">
            <input
              type="text"
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button className="btn mt-3" type="button" onClick={handleSubmit}>
            Logar
          </button>
          <Link className="mx-auto text-blue-600" to="/recuperar-senha">
            Recuperar senha
          </Link>
        </div>
      </div>
    </>
  );
}

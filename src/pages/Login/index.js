import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { At, Key } from 'phosphor-react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import Loading from '../../components/Loading';
import Svg from '../../components/SVG';
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
      <div className='container-body-login'>
        <Svg />
        <div className='container-login'>
          <h1 className='title-login'>Login</h1>
          <div className='content-inputs'>
            <div className="input-login">
              <span className='text-sm'>
                E-mail
              </span>
              <input
                type="text"
                name="email"
                className="input-animation"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <span className="absolute inset-y-0 top-6 left-0 flex items-center pl-2">
                <At size={24} />
              </span>
            </div>
            <div className="input-login">
              <span className='text-sm'>
                Senha
              </span>
              <input
                type="password"
                name="senha"
                className="input-animation"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} />
              <span className="absolute inset-y-0 top-6 left-0 flex items-center pl-2">
                <Key size={24} />
              </span>
            </div>
            <Link className="text-xs text-cinza-100 hover:text-cinza-300 duration-200 pl-2 select-none" to="/recuperar-senha">
              Esqueceu a senha?
            </Link>
            <button className="bg-verde-100 mt-8 mb-10 select-none hover:bg-verde-200 text-cinza-100 w-full py-1
             rounded-lg duration-150 shadow-sm hover:shadow-verde-200 shadow-verde-100"
              type="button"
              onClick={handleSubmit}>
              Entrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

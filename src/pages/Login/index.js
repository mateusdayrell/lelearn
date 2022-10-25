import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { EnvelopeSimple, Key } from 'phosphor-react';
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
      <div className='flex items-center justify-evenly px-10'>
        <Svg/>
        <div className='container-login'>
          <h1 className='title-login'>Login</h1>
          <div className='content-inputs'>
            <div class="input-login">
              <input
                type="text"
                name="email"
                placeholder="E-mail"
                class="input-animation"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                <EnvelopeSimple size={20} />
              </span>
            </div>
            <div class="input-login">
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                class="input-animation"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} />
              <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                <Key size={20} />
              </span>
            </div>
            <Link className="text-xs text-cinza-100 hover:text-cinza-300 duration-200 pl-2 select-none" to="/recuperar-senha">
              Esqueceu a senha?
            </Link>
            <button className="bg-verde-100 my-8 select-none hover:bg-verde-200 text-cinza-100 w-full py-1
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

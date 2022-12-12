import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Calendario from '../../components/Calendario';
import moment from 'moment/moment';

import './style.css';

export default function Home() {
  const location = useLocation();

  const { nome } = useSelector((state) => state.auth.usuario);

  const [nomeUsuario, setNomeUsuario] = useState('Não logado');

  useEffect(() => {
    getNome();
  }, [location]);

  const getNome = () => {
    setNomeUsuario(nome);
  }
  return (
    <>
      <div className='container-body'>
        <h1 className='title'>Olá, {nomeUsuario}!</h1>

        <div className='flex gap-2'>
          <div className='w-3/4 h-full text-cinza-200'>
            Teste
          </div>

          <div className='ContainerLateralHome'>
            <h2 className='text-laranja-100 font-semibold'>Cronograma</h2>
            <p className='text-xs text-cinza-600 font-semibold capitalize'>{moment().format('dddd')}, {moment().format('LL')}</p>
            <div className='mt-2'>
              <Calendario />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

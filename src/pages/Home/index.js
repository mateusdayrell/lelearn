import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './style.css';

export default function Home() {
  const location = useLocation();

  const { nome, tipo } = useSelector((state) => state.auth.usuario);

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
      </div>
    </>
  );
}

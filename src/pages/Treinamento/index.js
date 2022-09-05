import React, { useEffect, useState } from 'react';

import axios from '../../services/axios';
import Loading from '../../components/Loading';
import Navbar from '../../components/Navbar';
import './style.css';

export default function Treinamento() {
  const [treinamentos, setTreinamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTreinamentos();
  }, []);

  const getTreinamentos = async () => {
    setIsLoading(true);
    const { data } = await axios.get('/treinamentos');
    setTreinamentos(data);
    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <h1>Treinamentos</h1>
      <button>Olá</button>
      <div className="container">
        {treinamentos.map((treinamento) => (
          <div key={treinamento.cod_treinamento}>
            <div>{treinamento.nome_treinamento}</div>
          </div>
        ))}
      </div>
    </>
  );
}

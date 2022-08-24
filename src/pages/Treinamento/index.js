import React, { useEffect, useState } from 'react';

import axios from '../../services/axios';
import './style.css';

export default function Treinamento() {
  const [treinamentos, setTreinamentos] = useState([]);

  useEffect(() => {
    getTreinamentos();
  }, []);

  const getTreinamentos = async () => {
    const { data } = await axios.get('/treinamentos');
    setTreinamentos(data);
  };

  return (
    <>
      <h1>Treinamentos</h1>
      <div className="container">
        {treinamentos.map((treinamento) => (
          <div key={treinamento.cod_treinamento}>
            <p>{treinamento.nome_treinamento}</p>
          </div>
        ))}
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';

import axios from '../../services/axios';
import Loading from '../../components/Loading';
import { useSelector, useDispatch } from 'react-redux';
import CardTreinamento from '../../components/CardTreinamento';
// import './style.css';

export default function Treinamento() {
  // const dispatch = useDispatch();

  // const { cpf } = useSelector((state) => state.auth.usuario);
  // const [treinamentos, setTreinamentos] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   getTreinamentos();
  // }, []);

  // const getTreinamentos = async () => {
  //   setIsLoading(true);
  //   const { data } = await axios.get(`/treinamentos/get-by-usuario/${cpf}`);
  //   setTreinamentos(data);
  //   setIsLoading(false);
  // };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='container-body'>
        {/* <h1 className='title'>Treinamentos</h1>
        <button>Olá</button>
        <div className="container">
          {treinamentos.map((treinamento) => (
            <CardTreinamento
            key={treinamento}
            treinamento = {treinamento}/>
          ))}
        </div> */}
      </div>
    </>
  );
}

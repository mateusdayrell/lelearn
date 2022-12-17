import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment/moment';

import axios from '../../services/axios';
import Calendario from '../../components/Calendario';
import TimelineTreinamento from '../../components/TimelineTreinamento';
import Loading from '../../components/Loading';
import './style.css';

export default function Home() {
  const location = useLocation();

  const { nome, cpf } = useSelector((state) => state.auth.usuario);

  const [nomeUsuario, setNomeUsuario] = useState('Não logado');
  const [treinamentos, setTreinamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNome();
    getTreinamentos();
  }, [location]);

  const getNome = () => {
    setNomeUsuario(nome);
  }

  const getTreinamentos = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/usuarios/get-treinamentos/${cpf}`);
      setTreinamentos(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };
  return (
    <div className='container-body'>
        <Loading isLoading={isLoading}/>
        <h1 className='title'>Olá, {nomeUsuario}!</h1>

        <div className='flex gap-2'>
          <div className='w-3/4 h-full text-cinza-200'>
        Teste pé é gay
          </div>

          <div className='w-[1px] rounded h-50 bg-cinza-300 mx-2'/>

          <div className='ContainerLateralHome'>
            <div>
              <h2 className='text-laranja-100 font-semibold'>Cronograma</h2>
              <span className='text-xs text-azul-200 font-semibold flex'><span className='capitalize'>{moment().format('dddd')}</span>, {moment().format('LL')}</span>
            </div>

            <div className='mt-2'>
              <Calendario />
            </div>

            <div className='w-full h-full rounded-xl bg-cinza-400 p-2 mt-2 border-cinza-350 border-[1px] gap-2 flex flex-col'>
              {treinamentos.map((treinamento) => (
                <TimelineTreinamento
                  key={treinamento.cod_treinamento}
                  treinamento={treinamento} />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

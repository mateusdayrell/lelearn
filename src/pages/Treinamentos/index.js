import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';


import axios from '../../services/axios';
import Loading from '../../components/Loading';
import CardTreinamento from '../../components/CardTreinamento';
import { loginFailure } from '../../store/modules/auth/actions';
import history from '../../services/history';
// import './style.css';

export default function Treinamentos() {
  const dispatch = useDispatch();
  const { cpf } = useSelector((state) => state.auth.usuario);
  const [treinamentos, setTreinamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTreinamentos();
  }, []);

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

      if (error.response.status === 401) {
        dispatch(loginFailure());
        history.push('/login');
      }
    }
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='container-body'>
        <h1 className='title'>Treinamentos</h1>

        <div className='flex gap-3 flex-wrap'>
          {!treinamentos || treinamentos.length === 0
            ? <p className='text-cinza-300 text-xs'>Você não possui treinamentos.</p>
            : treinamentos.map((treinamento) => (
              <CardTreinamento
                key={treinamento.cod_treinamento}
                treinamento={treinamento} />
            ))}
        </div>

      </div>
    </>
  );
}

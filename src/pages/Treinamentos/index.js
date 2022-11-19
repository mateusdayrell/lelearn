import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import axios from '../../services/axios';
import Loading from '../../components/Loading';
import CardTreinamento from '../../components/CardTreinamento';
// import './style.css';

export default function Treinamentos() {
    const { cpf } = useSelector((state) => state.auth.usuario);
    const [treinamentos, setTreinamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getTreinamentos();
    }, []);

    const getTreinamentos = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/treinamentos/get-by-usuario/${cpf}`);
        setTreinamentos(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const { erros } = error.response.data;
        erros.map((err) => toast.error(err));
      }
    };

    return (
        <>
            <Loading isLoading={isLoading} />
            <div className='container-body'>
                <h1 className='title'>Treinamentos</h1>

                <div className='flex gap-3 flex-wrap'>
                    {treinamentos.map((treinamento) => (
                        <CardTreinamento
                            key={treinamento}
                            treinamento={treinamento} />
                    ))}
                </div>

            </div>
        </>
    );
}

import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import axios from '../../services/axios';
import Loading from '../../components/Loading';
import './style.css';

export default function Treinamento() {
  const history = useHistory();
  const params = useParams();
  const { cpf } = useSelector((state) => state.auth.usuario);

  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/treinamentos/get-cursos-usuario/${params.cod_treinamento}/${cpf}`);

      setCursos(data);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleRedirect = (cod_curso) => {
    history.push(`/cursos/${cod_curso}`);
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='container-body'>
        <h1 className='title'>Cursos do Treinamento</h1>
        <div className="container">
          {cursos.map((curso) => (
            <div key={curso.cod_curso}>
              <span>{curso.cod_curso} - {curso.nome_curso}</span>
              <button
                type='button'
                className='btn'
                onClick={() => handleRedirect(curso.cod_curso)}>
                  Acessar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

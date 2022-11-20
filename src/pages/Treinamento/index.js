import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Play } from 'phosphor-react';

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
              <div className='ContainerCurso'>
                <div className='flex items-center'>
                  {/* IMAGEM DO CURSO */}
                  <div className='h-[110px] w-[150px] min-h-[110px] min-w-[150px] bg-roxo-100'></div>
                  <div className='flex flex-col w-2/3 ml-6'>
                    <span className='NomeCursoList'>{curso.nome_curso}</span>
                    <span className='DescCurso'>{curso.desc_curso}</span>
                  </div>
                </div>
                <button
                  className='BtnCursoAcesso'
                  onClick={() => handleRedirect(curso.cod_curso)}>
                  <Play size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import axios from '../../services/axios';
import Loading from '../../components/Loading';
import CardCurso from '../../components/CardCurso';
import './style.css';

export default function Treinamento() {
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

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='container-body'>
      {cursos.length > 0 &&
        <>
          <h1 className='title'>{cursos[0].nome_treinamento}</h1>

          <div className='DescPage'>
          <p>{cursos[0].desc_treinamento}</p>
          {/* <span>Total de cursos: <br /> Total de cursos concluídos: </span> */}
      </div>
      </>
}
      <div className='BarPage' />
      <h1 className='SubTitle'>Cursos</h1>


        <div className='flex flex-wrap gap-3'>
          {cursos.map((curso) => (
            <CardCurso
              key={curso.cod_curso} curso={curso} assistidos={curso.videos_assistidos} total={curso.total_videos} />
          ))}
        </div>
      </div>
    </>
  );
}

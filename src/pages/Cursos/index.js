import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { FaFileImage } from 'react-icons/fa';

import './style.css';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getCursos();
  }, []);

  const getCursos = async () => {
    setIsLoading(true);
    const { data } = await axios.get('/cursos');
    setCursos(data);
    setIsLoading(false);
  };

  const handleRedirect = (cod_curso) => {
    history.push(`/cursos/${cod_curso}`);
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="container-body">
        <h1>Cursos</h1>
        {cursos.map((curso) => (
          <div key={curso.cod_curso} className="border p-2 text-white">
              {get(curso, 'arquivo_url', false) ?
                <img className='h-80 w-96' src={curso.arquivo_url} alt="Imagem do curso" />
                : <FaFileImage size={36}/>
              }
              <h2 className='text-xl'>{curso.nome_curso}</h2>
              <p>{curso.desc_curso}</p>
              <button
                type='button'
                className='btn'
                onClick={() => handleRedirect(curso.cod_curso)}
              >
                Acessar
              </button>
          </div>
        ))}
      </div>
    </>
  );
}

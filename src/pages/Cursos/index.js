import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { FaFileImage } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';

import './style.css';
import Loading from '../../components/Loading';
import axios from '../../services/axios';


export default function Cursos() {
  const dispatch = useDispatch();
  const { cpf } = useSelector((state) => state.auth.usuario);
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getCursos();
  }, []);

  const getCursos = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/cursos/get-by-user/${cpf}`);
    setCursos(data);
    setIsLoading(false);
  };

  const handleRedirect = (cod_curso) => {
    history.push(`/cursos/${cod_curso}`);
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container-body">
        <h1 className='title'>Cursos</h1>
        {cursos.map((curso) => (
          <div className='list-cursos'>
            <div key={curso.cod_curso} className="flex items-center gap-3">
              {get(curso, 'nome_arquivo', false) ?
                <img className='h-[110px] w-[150px] min-h-[110px] min-w-[150px]' src={`${process.env.REACT_APP_BACKEND_URL}/images/${curso.nome_arquivo}`} alt="Imagem do curso" />
                : <FaFileImage size={36} />
              }
              <div className='Cursos-info'>
                <h2 className='title-curso'>{`${curso.nome_curso}`}</h2>
                <p className='desc-curso '>{curso.desc_curso}</p>
              </div>
            </div>
            <div className='acessar-button'>
            <button
              type='button'
              className='block'
              onClick={() => handleRedirect(curso.cod_curso)}
            >
              <FaCaretRight
                className='play-button'
                size={37} 
                />
                <p className='msg-button'>Acessar</p>
            </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { FaCaretRight, FaFileImage } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { MagnifyingGlass, PaintBrushHousehold } from 'phosphor-react';

import './style.css';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function Cursos() {
  const { cpf } = useSelector((state) => state.auth.usuario);
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchNome, setSearchNome] = useState('');
  const history = useHistory();
  useEffect(() => {
    loadRegisters();
  }, []);
  
  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const cursosResponse = await axios.get('/cursos/');
      const videosReponse = await axios.get('/videos/');
      setIsLoading(false);
      setCursos(cursosResponse.data);
      setVideos(videosReponse.data)
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  useEffect(() => {
    getCursos();
  }, []);

  const getCursos = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/usuarios/get-cursos/${cpf}`);
    setCursos(data);
    setIsLoading(false);
  };
  const clearSearch = () => {
    setSearchNome('');
    loadRegisters();
  };

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      nome_curso: searchNome
    }).toString();

    setIsLoading(true);
    try {
      const { data } = await axios.get(`/cursos/search/${querys}`);

      setIsLoading(false);
      setCursos(data);
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

      <div className="container-body">
        <h1 className='title'>Cursos</h1>

        
        <div className='top-forms-container'>
          <div className="search-containers">
            <div className="search-form">
              <div className='search-container-inputs'>
                <input

                  className='search-input'
                  type="text"
                  name="titulo"
                  placeholder="Nome do curso"
                  value={searchNome}
                  onChange={(e) => setSearchNome(e.target.value)}
                />
                </div>
                <div className="search-container-buttons">
                  <button
                    title="Pesquisar"
                    className="green-btn mt-3 mb-3 h-10 w-10"
                    type="button"
                    onClick={handleSearch}
                  >
                    <MagnifyingGlass
                      size={24} />
                  </button>

                  <button
                    title="Limpar campos"
                    className="red-btn mt-3 mb-3 h-10 w-10"
                    type="button"
                    onClick={clearSearch}>
                    <PaintBrushHousehold size={24} />
                  </button>
                </div>
              </div>
            
          </div>
        </div>

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

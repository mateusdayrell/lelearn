import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MagnifyingGlass, PaintBrushHousehold } from 'phosphor-react';
import { toast } from 'react-toastify';
import moment from 'moment/moment';

import 'moment/locale/pt-br';
import './style.css';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import CardCurso from '../../components/CardCurso';

export default function Cursos() {
  moment.locale('pt-br');
  const { cpf } = useSelector((state) => state.auth.usuario);

  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchNome, setSearchNome] = useState('');

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/usuarios/get-cursos/${cpf}`);
      setIsLoading(false);
      setCursos(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
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
          <CardCurso
            key={curso.cod_curso} curso={curso} assistidos={curso.videos_assistidos} total={curso.total_videos} />
        ))}
      </div>
    </>
  );
}

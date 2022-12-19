import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MagnifyingGlass } from 'phosphor-react';
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
        <div className='flex justify-between'>
          <div className='title'>Cursos</div>
          <div className="SearchFormTitle">
            <div className='SearchInput'>
              <input
                type="text"
                name="titulo"
                placeholder="Pesquisar"
                value={searchNome}
                onChange={(e) => setSearchNome(e.target.value)}
              />
              <button
                title="Pesquisar"
                type="button"
                onClick={handleSearch}>
                <MagnifyingGlass size={24} />
              </button>
            </div>
          </div>
        </div>


        <div className='flex gap-3 flex-wrap'>
          {cursos.map((curso) => (
            <CardCurso
              key={curso.cod_curso} curso={curso} assistidos={curso.videos_assistidos} total={curso.total_videos} />
          ))}
        </div>
      </div>
    </>
  );
}

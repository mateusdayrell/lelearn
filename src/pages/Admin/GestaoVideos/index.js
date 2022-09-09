import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

import './style.css';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import axios from '../../../services/axios';

export default function GestaoVideos() {
  const [videos, setVideos] = useState([]);
  const [cursos, setCursos] = useState([]);
  // const [codVideo, setCodVideo] = useState('');
  // const [curso, setCurso] = useState('');
  // const [titulo, setTitulo] = useState('');
  // const [descricao, setDescricao] = useState('');
  // const [link, setLink] = useState('');

  const [searchTitulo, setSearchTitulo] = useState('');
  const [searchCurso, setSearchCurso] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const videosReponse = await axios.get('/videos/');
      const cursosResponse = await axios.get('/cursos/');

      setIsLoading(false);
      setVideos(videosReponse.data);
      setCursos(cursosResponse.data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      titulo_video: searchTitulo,
      cod_curso: searchCurso,
    }).toString();

    // if (!searchTitulo || !searchCurso) return;
    // console.log('OK');
    setIsLoading(true);

    try {
      const { data } = await axios.get(`/videos/search/${querys}`);

      setIsLoading(false);
      setVideos(data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const clearSearch = () => {
    setSearchTitulo('');
    setSearchCurso('');
    loadRegisters();
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div>
        <div className="search-container">
          <div className="search-form">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Título do vídeo"
              value={searchTitulo}
              onChange={(e) => setSearchTitulo(e.target.value)}
            />

            <label>Curso</label>
            <select
              name="curso"
              id="Curso"
              defaultValue={searchCurso}
              onChange={(e) => setSearchCurso(e.target.value)}
            >
              <option value="" disabled selected={searchCurso === ''}>
                Selecione um curso
              </option>
              {cursos.length > 0
                ? cursos.map((curso) => (
                    <option key={curso.cod_curso} value={curso.cod_curso}>
                      {curso.nome_curso}
                    </option>
                  ))
                : ''}
            </select>

            <div className="buttons">
              <button className="btn" type="button" onClick={handleSearch}>
                Pesquisar
              </button>
              <button className="btn" type="button" onClick={clearSearch}>
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-auto rounded-lg shadow-xl">
          <table className="w-full border-separate">
            <thead className="bg-gray-100 border-b-2 border-gray-200 ">
              <tr>
                <th className="p-3 font-semibold tracking-wide text-center">
                  Código
                </th>
                <th className="p-3 font-semibold tracking-wide text-center">
                  Título
                </th>
                <th className="p-3 font-semibold tracking-wide text-center">
                  Curso
                </th>
                <th className="p-3 font-semibold tracking-wide text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 ">
              {videos.map((video) => (
                <tr
                  key={video.cod_video}
                  className="even:bg-gray-50 odd:bg-white hover:bg-gray-200"
                >
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                    {video.cod_video}
                  </td>
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                    {video.titulo_video}
                  </td>
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                    {video.cod_curso}
                  </td>
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap flex justify-center gap-2">
                    <button type="button" className="round-blue-btn">
                      <FaPencilAlt />
                    </button>
                    <button type="button" className="round-red-btn">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

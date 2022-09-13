import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { get } from 'lodash';

import './style.css';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import axios from '../../../services/axios';

export default function GestaoVideos() {
  const [videos, setVideos] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [codVideo, setCodVideo] = useState('');
  const [codCurso, setCodCurso] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');

  const [searchTitulo, setSearchTitulo] = useState('');
  const [searchCurso, setSearchCurso] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

    setIsLoading(true);

    try {
      const { data } = await axios.get(`/videos/search/${querys}`);

      setIsLoading(false);
      setVideos(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const regTemp = {
        cod_video: codVideo,
        cod_curso: codCurso,
        titulo_video: titulo,
        link,
        desc_video: descricao,
      };

      setIsLoading(true);
      if (isUpdating) {
        await axios.put(`/videos/${codVideo}`, regTemp);
        toast.success('Vídeo atualizado com sucesso!');
      } else {
        await axios.post('/videos', regTemp);
        toast.success('Vídeo cadastrado com sucesso!');
      }
      setIsLoading(false);

      handleClose();
      setIsUpdating(false);
      loadRegisters();
    } catch (error) {
      setIsLoading(false);
      const erros = get(error, 'response.data.erros', []);
      erros.map((err) => {
        if (err === 'PRIMARY must be unique') {
          return toast.error('Código do vídeo já cadastrado');
        }
        return toast.error(err);
      });
    }
  };

  const handleDelete = async (codigo) => {
    setIsLoading(true);
    try {
      await axios.delete(`/videos/${codigo}`);

      setIsLoading(false);
      toast.success('Vídeo excluído com sucesso!');
      await loadRegisters();
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const validateForm = () => {
    let controle = true;

    if (!codVideo) {
      toast.error('Preencha o campo Código!');
      controle = false;
    }

    if (!codCurso) {
      toast.error('Preencha o campo Código!');
      controle = false;
    }

    if (!titulo) {
      toast.error('Preencha o campo Título!');
      controle = false;
    } else if (titulo.length < 3 || titulo.length > 40) {
      controle = false;
      toast.error('O campo Título deve ter entre 3 e 40 caracteres');
    }

    if (!link) {
      controle = false;
      toast.error('Preencha o campo Link!');
    } else if (link.length < 3 || link.length > 150) {
      controle = false;
      toast.error('O campo Link deve ter entre 3 e 150 caracteres');
    }

    if (descricao.length > 0 && descricao.length < 3) {
      controle = false;
      toast.error('O campo Descrição deve ter no mínimo 3 caracteres!');
    } else if (descricao.length > 150) {
      controle = false;
      toast.error('O campo Descrição deve ter no máximo 150 caracteres!');
    }

    return controle;
  };

  const handleIsUpdating = (vid) => {
    setIsUpdating(true);
    setShowModal(true);
    setCodVideo(vid.cod_video);
    setTitulo(vid.titulo_video);
    setCodCurso(vid.cod_curso);
    setLink(vid.link);
    setDescricao(vid.desc_video);
  };

  const clearSearch = () => {
    setSearchTitulo('');
    setSearchCurso('');
    loadRegisters();
  };

  const handleClose = () => {
    setShowModal(false);
    setShowModal(false);
    setIsUpdating(false);
    clearModal();
  };

  const clearModal = () => {
    setCodVideo('');
    setCodCurso('');
    setTitulo('');
    setLink('');
    setDescricao('');
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
                ? cursos.map((c) => (
                    <option key={c.cod_curso} value={c.cod_curso}>
                      {c.nome_curso}
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
                    {video.curso ? video.curso.nome_curso : video.cod_curso}
                  </td>
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap flex justify-center gap-2">
                    <button
                      type="button"
                      className="round-blue-btn"
                      onClick={() => handleIsUpdating(video)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      type="button"
                      className="round-red-btn"
                      onClick={() => handleDelete(video.cod_video)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="btn mx-auto my-5"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Cadastrar
        </button>

        <Modal
          isOpen={showModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="ModalHeader">
            <span>{isUpdating ? 'Editar' : 'Cadastrar'} vídeo</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              x
            </button>
          </div>
          <div className="ModalContent">
            <div className="form-gestao-video">
              <label>Código</label>
              <input
                type="text"
                name="cod_video"
                placeholder="Código"
                disabled={!!isUpdating}
                value={codVideo}
                onChange={(e) => setCodVideo(e.target.value)}
              />

              <label>Curso</label>
              <select
                name="curso"
                defaultValue={codCurso}
                onChange={(e) => setCodCurso(e.target.value)}
              >
                <option value="" disabled selected={codCurso === ''}>
                  Selecione um curso
                </option>
                {cursos.length > 0
                  ? cursos.map((item) => (
                      <option key={item.cod_curso} value={item.cod_curso}>
                        {item.nome_curso}
                      </option>
                    ))
                  : ''}
              </select>

              <label>Título</label>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                maxLength="40"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />

              <label>Link</label>
              <input
                type="text"
                name="link"
                placeholder="Link"
                maxLength="150"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />

              <label>Descrição</label>
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>
          <div className="ModalFooter">
            <button className="btn" type="button" onClick={clearModal}>
              Limpar
            </button>
            <button className="btn" type="button" onClick={handleSubmit}>
              {isUpdating ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

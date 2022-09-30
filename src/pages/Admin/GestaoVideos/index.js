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
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      erros.map((err) => toast.error(err));
    }
  };

  const handleDelete = async (codigo) => {
    handleClose();
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
    setShowFormModal(true);
    setCodVideo(vid.cod_video);
    setTitulo(vid.titulo_video);
    setCodCurso(vid.cod_curso);
    setLink(vid.link);
    setDescricao(vid.desc_video);
    setShowDeleteModal(false);
  };

  const handleIsDeleting = (cod) => {
    setCodVideo(cod);
    setShowDeleteModal(true);
  };

  const clearSearch = () => {
    setSearchTitulo('');
    setSearchCurso('');
    loadRegisters();
  };

  const handleClose = () => {
    setShowFormModal(false);
    setShowDeleteModal(false);
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
      <div className="container-body">
        <h1 className="title">Gestão de Vídeos</h1>

        <div className="search-container">
          <p className="search-title">Pesquisar</p>
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              name="titulo"
              placeholder="Título do vídeo"
              value={searchTitulo}
              onChange={(e) => setSearchTitulo(e.target.value)}
            />
            <select
              name="curso"
              className="search-input"
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

            <div className="flex gap-3">
              <button
                className="green-btn"
                type="button"
                onClick={handleSearch}
              >
                Pesquisar
              </button>
              <button className="red-btn" type="button" onClick={clearSearch}>
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div className="w-[98%] h-[1px] mx-3 my-6" />
        <div className="bg-[#1E1E1E] border-2 border-[#1E1E1E] rounded-xl p-6 my-2">
          <div className="bg-[#1E1E1E] shadow-xl py-[16px 0 16px 16px]">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Curso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.cod_video}>
                    <td className="">{video.cod_video}</td>
                    <td className="">{video.titulo_video}</td>
                    <td className="">
                      {video.curso ? video.curso.nome_curso : video.cod_curso}
                    </td>
                    <td className="border-r-2">
                      <span className="flex justify-center gap-2">
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
                          onClick={() => handleIsDeleting(video.cod_video)}
                        >
                          <FaTrashAlt />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="btn mx-auto my-5"
            type="button"
            onClick={() => setShowFormModal(true)}
          >
            Cadastrar
          </button>
        </div>

        <Modal
          isOpen={shwoFormModal}
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
              {isUpdating ?
                <div className="ModalInput">
                  <label>Código</label>
                  <input
                    type="text"
                    name="cod_video"
                    placeholder="Código"
                    disabled
                    value={codVideo}
                    onChange={(e) => setCodVideo(e.target.value)}
                  />
                </div>
                : '' }

              <div className="ModalInput">
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
              </div>

              <div className="ModalInput">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  placeholder="Título"
                  maxLength="40"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Link</label>
                <input
                  type="text"
                  name="link"
                  placeholder="Link"
                  maxLength="150"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="ModalInput">
                <label>Descrição</label>
                <textarea
                  name="descricao"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="ModalFooter">
            <button className="red-btn" type="button" onClick={clearModal}>
              Limpar
            </button>
            <button className="green-btn" type="button" onClick={handleSubmit}>
              {isUpdating ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="ModalHeader">
            <span>Excluir vídeo</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              x
            </button>
          </div>
          <div className="ModalContent">
            <div className="px-8 max-w-xl">
              <p>
                Caso prossiga com a exclusão do item, o mesmo não será mais
                recuperado. Deseja realmente excluir o vídeo {codVideo}?
              </p>
            </div>
          </div>
          <div className="ModalFooter">
            <button className="yellow-btn" type="button" onClick={handleClose}>
              Cancelar
            </button>
            <button
              className="red-btn"
              type="button"
              onClick={() => handleDelete(codVideo)}
            >
              Excluir
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { MagnifyingGlass, PaintBrushHousehold, Plus, X } from 'phosphor-react';
import Modal from 'react-modal';
import { get } from 'lodash';

import './style.css';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import OrderSelect from '../../../components/OrderSelect';
import Pagination from '../../../components/Pagination';
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
  const [searchOrdem, setSearchOrdem] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const itemsPerPage = 10
  const [inicio, setInicio] = useState(0)
  const [fim, setFim] = useState(itemsPerPage)

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

  const handleOrderChange = (array, ordem) => {
    setVideos(array)
    setSearchOrdem(ordem)
  }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="container-body container-video">
        <h1 className="title">Gestão de Vídeos</h1>

        <div className='top-forms-container'>
          <div className="search-container">
            <div className="search-form">
              <div className='search-container-inputs'>
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
              </div>

              <div className="search-container-buttons">
                <button
                  title="Pesquisar"
                  className="round-green-btn"
                  type="button"
                  onClick={handleSearch}
                >
                  <MagnifyingGlass size={24} />
                </button>
                <button
                  title="Limpar campos"
                  className="red-btn"
                  type="button"
                  onClick={clearSearch}>
                  <PaintBrushHousehold size={24} />
                </button>
              </div>
            </div>
          </div>
          <span className='flex justify-center items-center w-1/4'>
            <button
              title="Cadastrar vídeo"
              className="green-btn"
              type="button"
              onClick={() => setShowFormModal(true)}
            >
              <Plus size={24} />
            </button>
          </span>
        </div>

        <div className='mt-4 mb-8 ml-2'>
          <OrderSelect
            nameKey="titulo_video"
            handleOrderChange={handleOrderChange}
            searchOrdem={searchOrdem}
            array={videos} />
        </div>

        <div className='text-[#d1d7e1]'>
          {videos.slice(inicio, fim).map((video) => (
            <div
              key={video.cod_video}
              className="w-full shadow-md shadow-zinc-700 rounded-lg py-4 pl-6 pr-8 mb-3 bg-[#323238] flex justify-between items-center"
            >
              <span>
                <span className='border-r-2 py-2 pr-3 border-verde-100'>{video.cod_video}</span>
                <span className='pl-3'>{video.titulo_video}</span>
                <span className='text-sm text-azul-100 rounded px-1 pb-[2px] ml-3'>
                  <small>{video.curso ? video.curso.nome_curso : ''}</small>
                </span>
              </span>

              <span className='flex gap-5'>
                <button
                  type="button"
                  title="Editar"
                  className='round-green-btn'
                  onClick={() => handleIsUpdating(video)}
                >
                  <FaPencilAlt/>
                </button>
                <button
                  type="button"
                  title="Excluir"
                  className='red-btn'
                  onClick={() => handleIsDeleting(video.cod_video)}
                >
                  <FaTrashAlt />
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className='mt-3 ml-2'>
          {videos &&
              <Pagination
                total={videos.length}
                itemsPerPage={itemsPerPage}
                handleNewPage={handleNewPage} />
          }
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
            <button
              title="Fechar"
              className="CloseModal"
              type="button"
              onClick={handleClose}>
              <X size={24} />
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
                : ''}

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
            <button
              title="Limpar campos"
              className="bg-vermelho-100 text-white w-24 py-2 rounded-xl hover:bg-vermelho-200"
              type="button"
              onClick={clearModal}>
              Limpar
            </button>
            <button
              className="bg-verde-100 text-white w-24 py-2 rounded-xl hover:bg-verde-200"
              title={isUpdating ? 'Atualizar dados' : 'Salvar dados'}
              type="button"
              onClick={handleSubmit}>
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
            <button
              title="Fechar"
              className="CloseModal"
              type="button"
              onClick={handleClose}>
              <X size={24} />
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
          <button
             className="bg-verde-100 text-white w-24 py-2 rounded-xl hover:bg-verde-200"
             title="Cancelar"
             type="button"
             onClick={handleClose} >
              Cancelar
            </button>
            <button
              className="bg-vermelho-100 text-white w-24 py-2 rounded-xl hover:bg-vermelho-200"
              title="Excluir"
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

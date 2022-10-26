import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlass, PaintBrushHousehold, Plus, X, PencilSimple, TrashSimple } from 'phosphor-react';
import Modal from 'react-modal';
import { get } from 'lodash';

import './style.css';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import OrderSelect from '../../../components/OrderSelect';
import Pagination from '../../../components/Pagination';
import Multiselect from '../../../components/Multiselect';
import axios from '../../../services/axios';

const ITEMS_PER_PAGE = 10

export default function GestaoVideos() {
  const [videos, setVideos] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [codVideo, setCodVideo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [videoCursos, setVideoCursos] = useState([])

  const [searchTitulo, setSearchTitulo] = useState('');
  const [searchCurso, setSearchCurso] = useState('');
  const [searchOrdem, setSearchOrdem] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [inicio, setInicio] = useState(0)
  const [fim, setFim] = useState(ITEMS_PER_PAGE)

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
        titulo_video: titulo,
        cursos: videoCursos,
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
    setVideoCursos(vid.cursos)
    setLink(vid.link);
    setDescricao(vid.desc_video);
    setShowDeleteModal(false);
  };

  const handleIsDeleting = (vid) => {
    setCodVideo(vid.cod_video);
    setTitulo(vid.titulo_video)
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

  const clearModal = (parameter) => {
    if (!parameter) setCodVideo('');
    setTitulo('');
    setVideoCursos([])
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

  const handleMultiSelectChange = (type, obj) => {
      const newArrayCursos = [...videoCursos]

      newArrayCursos.push(JSON.parse(obj)) // converter string para objeto
      newArrayCursos.sort((a, b) => a.nome_curso > b.nome_curso ? 1 : -1) // ordenar por nome

      setVideoCursos(newArrayCursos)
  }

  const handleMultiSelectRemove = (type, cod) => {
      const newArrayCursos = videoCursos.filter(el => el.cod_curso !== cod); // remover obj do array
      setVideoCursos(newArrayCursos)
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
                  value={searchCurso}
                  onChange={(e) => setSearchCurso(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um curso
                  </option>
                  {cursos.length > 0
                    ? cursos.map((c) => (
                      <option key={`s1${c.cod_curso}`} value={c.cod_curso}>
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
          <span className='search-container-cadastrar'>
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

        <div className='container-order'>
          <OrderSelect
            nameKey="titulo_video"
            handleOrderChange={handleOrderChange}
            searchOrdem={searchOrdem}
            array={videos} />
        </div>

        <div className='container-list'>
          {videos.slice(inicio, fim).map((video) => (
            <div
              key={`vid${video.cod_video}`}
              className="list"
            >
              <div className='container-information-list'>
                <span className='cod-container-list'>{video.cod_video}</span>
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{video.titulo_video}</span>
                  {/*{video.cursos.length > 0 ?
                    video.cursos.map(item => (
                      <span key={item.cod_curso} className='subname-container-list-blue'>
                        <small>{item.nome_curso}</small>
                      </span>
                    ))
                  : ''}*/}
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title="Editar"
                  className='round-green-btn'
                  onClick={() => handleIsUpdating(video)}
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  type="button"
                  title="Excluir"
                  className='red-btn'
                  onClick={() => handleIsDeleting(video)}
                >
                  <TrashSimple size={20} />
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className='mt-3 ml-2'>
          {videos &&
            <Pagination
              total={videos.length}
              itemsPerPage={ITEMS_PER_PAGE}
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
                <div className="InputArea">
                  <label>Código</label>
                  <input
                    type="text"
                    className='ModalInput'
                    name="cod_video"
                    placeholder="Código"
                    disabled
                    value={codVideo}
                    onChange={(e) => setCodVideo(e.target.value)}
                  />
                </div>
                : ''}

              <div className="InputArea">
                <label>Título</label>
                <input
                  type="text"
                  className='ModalInput'
                  name="titulo"
                  placeholder="Título"
                  maxLength="40"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="InputArea">
                <label>Vincular Cursos <small>(opcional)</small></label>
                <Multiselect
                  type="curso"
                  arrLista={cursos}
                  arrSuperior={videoCursos}
                  value="cod_curso"
                  label="nome_curso"
                  handleMultiSelectChange={handleMultiSelectChange}
                  handleMultiSelectRemove={handleMultiSelectRemove}
                />
              </div>

              <div className="InputArea">
                <label>Link</label>
                <input
                  type="text"
                  className='ModalInput'
                  name="link"
                  placeholder="Link"
                  maxLength="150"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="InputArea">
                <label>Descrição <small>(opcional)</small></label>
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
              onClick={() => clearModal("limpar")}>
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
                recuperado. Deseja realmente excluir o vídeo {titulo}?
              </p>
            </div>
          </div>
          <div className="ModalFooter">
            <button
              className="bg-cinza-300 text-white w-24 py-2 rounded-xl hover:bg-gray-500"
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

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { get } from 'lodash';
import { MagnifyingGlass, PaintBrushHousehold, PencilSimple, Plus, TrashSimple, X } from 'phosphor-react';
import OrderSelect from '../../../components/OrderSelect';

import './style.css';

import axios from '../../../services/axios';
import Navbar from '../../../components/Navbar';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import FileInput from '../../../components/FileInput';
import Multiselect from '../../../components/Multiselect';
import { orderVideos } from '../../../helpers/orderVideos';

const ITEMS_PER_PAGE = 10

export default function GestaoCursos() {
  const [cursos, setCursos] = useState([]);
  const [videos, setVideos] = useState([]);

  const [codCurso, setCodCurso] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState(null);
  const [cursoVideos, setCursoVideos] = useState([])
  const [foto, setFoto] = useState(null)
  const [showFoto, setShowFoto] = useState('')

  const [searchNome, setSearchNome] = useState('');
  const [searchVideo, setSearchVideo] = useState('')
  const [searchOrdem, setSearchOrdem] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [inicio, setInicio] = useState(0)
  const [fim, setFim] = useState(ITEMS_PER_PAGE)

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

  const handleOrderChange = (array, ordem) => {
    setCursos(array)
    setSearchOrdem(ordem)
  }

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      nome_curso: searchNome,
      cod_video: searchVideo
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData()
    formData.append('nome_curso', nome)
    formData.append('desc_curso', descricao)
    formData.append('videos', JSON.stringify(cursoVideos))
    if (foto) formData.append('foto', foto)

    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }

    try {
      setIsLoading(true);

      if (isUpdating) {
        await axios.put(`/cursos/${codCurso}`, formData, header)
        toast.success('Curso atualizado com sucesso!');
      } else {
        await axios.post('/cursos', formData, header);
        toast.success('Curso cadastrado com sucesso!');
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
      await axios.delete(`/cursos/${codigo}`);

      setIsLoading(false);
      toast.success('Curso excluído com sucesso!');
      await loadRegisters();
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const validateForm = () => {
    let validated = true;

    if (!nome) {
      toast.error('Preencha o campo Nome!');
      validated = false;
    } else if (nome.length < 3 || nome.length > 40) {
      validated = false;
      toast.error('O campo Nome deve ter entre 3 e 40 caracteres');
    }

    if (descricao && (descricao.length < 3 || descricao.length > 150)) {
      validated = false;
      toast.error('O campo Descrição deve ter entre 3 e 150 caracteres');
    }

    return validated;
  };

  const handleIsUpdating = async (curso) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/videos/get-by-curso/${curso.cod_curso}`);
      setIsLoading(false);

      setCursoVideos(orderVideos(data));
      setCodCurso(curso.cod_curso);
      setNome(curso.nome_curso);
      setDescricao(curso.desc_curso);
      if (curso.arquivo_url) setShowFoto(curso.arquivo_url)

      setIsUpdating(true);
      setShowFormModal(true);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleIsDeleting = (curso) => {
    setCodCurso(curso.cod_curso);
    setNome(curso.nome_curso);
    setShowDeleteModal(true);
  };

  const handleClose = () => {
    setShowFormModal(false);
    setShowDeleteModal(false);
    setIsUpdating(false);
    clearModal();
  };

  const clearSearch = () => {
    setSearchNome('');
    loadRegisters();
  };

  const clearModal = (parameter) => {
    if (!parameter) setCodCurso('');
    setNome('');
    setDescricao('');
    setFoto(null);
    setShowFoto('')
    setCursoVideos([]);
  };

  const handleShowFoto = (e) => {
    const file = e.target.files[0]
    const fileUrl = URL.createObjectURL(file)
    setFoto(file)
    setShowFoto(fileUrl)
  }

  const handleRemoveFoto = () => {
    setFoto(null)
    setShowFoto('')
  }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="container-body g-curso-container">
        <h1 className="title">Gestão de Cursos</h1>

        <div className="top-forms-container">
          <div className="search-container">

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
                <select
                  name="video"
                  className="search-input"
                  id="video"
                  value={searchVideo}
                  onChange={(e) => setSearchVideo(e.target.value)}>
                  <option value="" disabled >Selecione um vídeo</option>
                  {videos.length > 0
                    ? videos.map((c) => (
                      <option key={`s${c.cod_video}`} value={c.cod_video}>
                        {c.titulo_video}
                      </option>
                    ))
                    : ''}
                </select>
              </div>
              <div className="search-container-buttons">
                <button
                  title="Pesquisar"
                  className="green-btn"
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
              title="Cadastrar curso"
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
            nameKey="nome_curso"
            handleOrderChange={handleOrderChange}
            searchOrdem={searchOrdem}
            array={cursos} />
        </div>

        <div className="container-list">
          {cursos.slice(inicio, fim).map((curso) => (
            <div
              key={curso.cod_curso}
              className="list"
            >
              <div className='container-information-list'>
                <span className='cod-container-list'>{curso.cod_curso}</span>
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{curso.nome_curso}</span>
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title="Editar"
                  className='round-green-btn'
                  onClick={() => handleIsUpdating(curso)}
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  type="button"
                  title="Excluir"
                  className='red-btn'
                  onClick={() => handleIsDeleting(curso)}
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
              total={cursos.length}
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
            <span>{isUpdating ? 'Editar' : 'Cadastrar'} curso</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          <div className="ModalContent">
            <div className="FormInputGestao">
              {isUpdating ? (
                <div className="InputArea">
                  <label>Código</label>
                  <input
                    type="text"
                    className='ModalInput'
                    name="cod_video"
                    disabled
                    value={codCurso}
                    onChange={(e) => setCodCurso(e.target.value)}
                  />
                </div>
              ) : (
                ''
              )}

              <div className="InputArea">
                <label>Nome *</label>
                <input
                  type="text"
                  className='ModalInput'
                  name="nome"
                  maxLength="40"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="InputArea">
                <label>Foto <small>(Opcional)</small></label>
                <FileInput handleShowFile={handleShowFoto} foto={showFoto} removeFoto={handleRemoveFoto} />
              </div>

              <div className="InputArea">
                <label>Descrição <small>(Opcional)</small></label>
                <textarea
                  name="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="InputArea">
                <label>Vincular Vídeos <small>(Opcional)</small></label>
                <Multiselect
                  type="vídeo"
                  listaArr={videos}
                  array={cursoVideos}
                  setArray={setCursoVideos}
                  value="cod_video"
                  label="titulo_video"
                />
              </div>
            </div>
          </div>

          <p className='InformationP'><i>Campos com ( * ) devem ser preenchidos obrigatoriamente.</i></p>

          <div className="ModalFooter">
            <button className="RedBtn" type="button" onClick={() => clearModal("limpar")}>
              Limpar
            </button>
            <button className="GreenBtn" type="button" onClick={handleSubmit}>
              {isUpdating ? 'Atualizar' : 'Cadastrar'}
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
            <span>Excluir curso</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          <div className="ModalContent">
            <div className="FormDelete">
              <p>
                Caso prossiga com a exclusão do item, o mesmo não será mais
                recuperado.
              </p>
              <p>
                Deseja realmente excluir o curso <i>{nome}</i> ?
              </p>
            </div>
          </div>

          <div className="ModalFooter">
            <button
              className="GrayBtn"
              type="button"
              onClick={handleClose}>
              Cancelar
            </button>
            <button
              className="RedBtn"
              type="button"
              onClick={() => handleDelete(codCurso)}
            >
              Excluir
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

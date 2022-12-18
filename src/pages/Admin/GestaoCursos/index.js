/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { get } from 'lodash';
import { MagnifyingGlass, PaintBrushHousehold, PencilSimple, Plus, TrashSimple, X, Eye, MinusCircle } from 'phosphor-react';
import { useDispatch } from 'react-redux';
import OrderSelect from '../../../components/OrderSelect';

import './style.css';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
// import FileInput from '../../../components/FileInput';
import Multiselect from '../../../components/Multiselect';
import { orderVideos } from '../../../helpers/orderVideos';
import DeleteModal from '../../../components/DeleteModal';
import history from '../../../services/history';
import * as actions from '../../../store/modules/auth/actions';

const ITEMS_PER_PAGE = 10

export default function GestaoCursos() {
  const dispatch = useDispatch();

  const [cursos, setCursos] = useState([]);
  const [videos, setVideos] = useState([]);

  const [codCurso, setCodCurso] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState(null);
  const [cursoVideos, setCursoVideos] = useState([])
  const [foto, setFoto] = useState(null)
  // const [showFoto, setShowFoto] = useState('')
  const [deleted, setDeleted] = useState(false)

  const [searchNome, setSearchNome] = useState('');
  const [searchVideo, setSearchVideo] = useState('')
  const [searchOrdem, setSearchOrdem] = useState('');
  const [searchStatus, setSearchStatus] = useState('ativo');

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState(0)
  const selected = 'bg-transparent hover:bg-transparent shadow-none text-sm p-0 mt-3 text-cinza-100 hover:text-cinza-300 transition-all'

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
      setCursos(cursosResponse?.data);
      setVideos(videosReponse?.data)
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
      if(error.response.status === 401) {
        dispatch(actions.loginFailure());
        history.push('/login');
      }
    }
  };

  const handleOrderChange = (array, ordem) => {
    setCursos(array)
    setSearchOrdem(ordem)
  }

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      nome_curso: searchNome,
      cod_video: searchVideo,
      status: searchStatus,
    }).toString();
    try {
      let response = null;

      setIsLoading(true);
      if (querys.length > 0) {
        response = await axios.get(`/cursos/search/${querys}`);
      } else {
        response = await axios.get(`/cursos`);
      }

      setIsLoading(false);
      setCursos(response?.data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));

      if(error.response.status === 401) {
        dispatch(actions.loginFailure());
        history.push('/login');
      }
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
      if (deleted) toast.success('Curso excluído com sucesso!')
      else toast.success('Curso desativado com sucesso!')
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
      const { data } = await axios.get(`/cursos/get-videos/${curso.cod_curso}`);
      setIsLoading(false);

      setCursoVideos(orderVideos(data));
      setCodCurso(curso?.cod_curso);
      setNome(curso?.nome_curso);
      setDescricao(curso?.desc_curso);
      // if (curso.arquivo_url) setShowFoto(curso.arquivo_url)
      setDeleted(!!curso.deleted_at)

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
    setDeleted(!!curso.deleted_at)
    setShowDeleteModal(true);
  };

  const handleClose = () => {
    setShowFormModal(false);
    setShowDeleteModal(false);
    setIsUpdating(false);
    clearModal();
    setForm(0);
  };

  const clearSearch = () => {
    setSearchNome('');
    setSearchStatus('ativo')
    loadRegisters();
  };

  const clearModal = (parameter) => {
    if (!parameter) setCodCurso('');
    setNome('');
    setDescricao('');
    setFoto(null);
    // setShowFoto('')
    setDeleted(false)
    setCursoVideos([]);
  };

  const clearFormModal = () => {
    if (form === 0) {
      setNome('');
      setDescricao('');
      setFoto(null);
      // setShowFoto('');
    }
    if (form === 1) setCursoVideos([]);
  }

  // const handleShowFoto = (e) => {
  //   const file = e.target.files[0]
  //   const fileUrl = URL.createObjectURL(file)
  //   setFoto(file)
  //   setShowFoto(fileUrl)
  // }

  // const handleRemoveFoto = () => {
  //   setFoto(null)
  //   setShowFoto('')
  // }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  const handleActivate = async (cod) => {
    try {
      setIsLoading(true);
      await axios.put(`/cursos/activate/${cod}`);
      setIsLoading(false);
      toast.success('Curso ativado com sucesso.');
      handleClose();
      handleSearch();
    } catch (error) {
      setIsLoading(false)
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  }

  return (
    <>
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
                  onChange={(e) => setSearchNome(e.target.value)} />

                <select
                  name="video"
                  className="search-input"
                  id="video"
                  value={searchVideo}
                  onChange={(e) => setSearchVideo(e.target.value)}>
                  <option value="" disabled >Selecione um vídeo</option>
                  {videos?.length > 0
                    ? videos.map((c) => (
                      <option key={`s${c.cod_video}`} value={c.cod_video}>
                        {c.titulo_video}
                      </option>
                    ))
                    : ''}
                </select>

                <select
                  className="search-input"
                  name="status"
                  id="status"
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)} >
                  <option value="" disabled>
                    Selecione um status
                  </option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="ambos">Ambos</option>
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
                  className="gray-btn"
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
          {!cursos || cursos?.length === 0 ?
            <div className='w-full h-full text-center text-cinza-200 text-lg'>
              <p>Nenhum curso encontrado.</p>
            </div>
          : cursos?.slice(inicio, fim).map((curso) => (
            <div
              key={curso.cod_curso}
              className="list"
            >
              <div className='container-information-list'>
                {/* <span className='cod-container-list'>{curso.cod_curso}</span> */}
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{curso.nome_curso}</span>
                  <span className={curso.deleted_at ? 'subname-container-list-red' : 'hidden'}>
                    <small>{curso.deleted_at ? 'Curso desativado' : ''}</small>
                  </span>
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title={curso.deleted_at ? "Visualizar" : "Editar"}
                  className={curso.deleted_at ? 'round-blue-btn':'round-green-btn'}
                  onClick={() => handleIsUpdating(curso)}
                >
                  {curso.deleted_at
                    ? <Eye size={20} />
                    : <PencilSimple size={20} />
                  }
                </button>
                <button
                  type="button"
                  title={curso.deleted_at ? "Excluir" : "Desativar"}
                  className='red-btn'
                  onClick={() => handleIsDeleting(curso)}
                >
                  {curso.deleted_at
                    ? <TrashSimple size={20} />
                    : <MinusCircle size={20} />
                  }
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className='mt-3 ml-2'>
          {videos &&
            <Pagination
              total={cursos?.length}
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
            <span>{isUpdating ? deleted ? 'Visualizar' : 'Editar' : 'Cadastrar'} curso</span>
            <button className="CloseModal" title='Fechar' type="button" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>

          <div className='ContentBtnsLists'>
            <button
              type='button'
              className={(form === 0) ? `${selected}` : "BtnModal"}
              onClick={() => setForm(0)}>
              Curso
            </button>

            <div className='BarBtnsLists' />

            <button
              type="button"
              className={form === 1 ? `${selected}` : "BtnModal"}
              onClick={() => setForm(1)}>
              Vídeos
            </button>
          </div>

          {form === 0 &&
            <div className="ModalContent">
              <div className="FormInputGestao">
                {/* {isUpdating ? (
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
              )} */}

                <div className="InputArea">
                  <label>Nome *</label>
                  <input
                    type="text"
                    className='ModalInput'
                    name="nome"
                    maxLength="40"
                    disabled={deleted}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                {/* <div className="InputArea">
                  <label>Foto </label>
                  <FileInput handleShowFile={handleShowFoto} foto={showFoto} removeFoto={handleRemoveFoto} deleted={deleted} />
                </div>
            */}
                <div className="InputArea">
                  <label>Descrição </label>
                  <textarea
                    name="descricao"
                    disabled={deleted}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
              </div>
            </div>
          }

          {form === 1 &&
            <div className='ModalContent'>
              <div className="InputArea">
                <label>{deleted ? 'Vídeos' : 'Vincular vídeos'}</label>
                <Multiselect
                  type="vídeo"
                  listaArr={videos}
                  array={cursoVideos}
                  setArray={setCursoVideos}
                  value="cod_video"
                  label="titulo_video"
                  deleted={deleted}
                />
              </div>
            </div>
          }

          {
            deleted
              ?
              <div className="ModalFooter">
                <button
                  className="GrayBtn"
                  type="button"
                  onClick={handleClose}>
                  Fechar
                </button>
                <button
                  className="GreenBtn"
                  type="button"
                  onClick={() => handleActivate(codCurso)}>
                  Ativar
                </button>
              </div>
              :
              <>
                <p className='InformationP'><i>Campos com ( * ) devem ser preenchidos obrigatoriamente.</i></p>

                <div className="ModalFooter">
                  <button className="RedBtn" type="button" onClick={() => clearFormModal()}>
                    Limpar
                  </button>
                  <button className="GreenBtn" type="button" onClick={handleSubmit}>
                    {isUpdating ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </>
          }
        </Modal >

        <DeleteModal
          showDeleteModal={showDeleteModal} handleClose={handleClose} deleted={deleted}
          type="curso" name={nome} handleDelete={handleDelete} code={codCurso}
        />
      </div >
    </>
  );
}

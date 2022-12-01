import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlass, PaintBrushHousehold, X, PencilSimple, TrashSimple } from 'phosphor-react';
import Modal from 'react-modal';
import { get } from 'lodash';

import './style.css';
import Loading from '../../../components/Loading';
import OrderSelect from '../../../components/OrderSelect';
import Pagination from '../../../components/Pagination';
import axios from '../../../services/axios';
import DeleteModal from '../../../components/DeleteModal';

const ITEMS_PER_PAGE = 10

export default function GestaoComentarios() {
  const [comentarios, setComentarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [videosDoCurso, setVideosDoCurso] = useState([])

  const [codComentario, setCodComentario] = useState('');
  const [texto, setTexto] = useState('');
  const [usuario, setUsuario] = useState({});
  const [video, setVideo] = useState({});
  const [cursosComentario, setCursosComentario] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [respostasTotal, setRespostasTotal] = useState('');
  const [respostasPendentes, setRespostasPendentes] = useState('');

  const [serachTexto, setSearchTexto] = useState('');
  const [searchCurso, setSearchCurso] = useState('');
  const [searchVideo, setSearchVideo] = useState('');
  const [searchUsuario, setSearchUsuario] = useState('')
  const [searchOrdem, setSearchOrdem] = useState('');

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
      const cursosResponse = await axios.get('/cursos/');
      const usuariosResponse = await axios.get('/usuarios/');
      const comentariosResponse = await axios.get('/comentarios/');

      setIsLoading(false);
      setComentarios(comentariosResponse.data);
      setCursos(cursosResponse.data);
      setUsuarios(usuariosResponse.data)
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSearch = async () => {
    const codigosVideo = videosDoCurso.flatMap((el) => el.cod_video);
    const querys = new URLSearchParams({
      texto: serachTexto,
      videos: codigosVideo,
      cod_video: searchVideo,
      cpf: searchUsuario,
    }).toString();

    setIsLoading(true);

    try {
      let response = null
      if (serachTexto || searchCurso || searchVideo || searchUsuario) {
        response = await axios.get(`/comentarios/search/${querys}`);
      } else {
        response = await axios.get('/comentarios/');
      }

      setIsLoading(false);
      setComentarios(response.data);
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
        texto,
      };

      setIsLoading(true);
      if (isUpdating) {
        await axios.put(`/videos/${codComentario}`, regTemp);
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
      toast.success('Vídeo excluído com sucesso!')
      await loadRegisters();
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const validateForm = () => {
    const controle = true;

    // if (!titulo) {
    //   toast.error('Preencha o campo Título!');
    //   controle = false;
    // } else if (titulo.length < 3 || titulo.length > 40) {
    //   controle = false;
    //   toast.error('O campo Título deve ter entre 3 e 40 caracteres');
    // }

    // if (!link) {
    //   controle = false;
    //   toast.error('Preencha o campo Link!');
    // } else if (link.length < 3 || link.length > 150) {
    //   controle = false;
    //   toast.error('O campo Link deve ter entre 3 e 150 caracteres');
    // }

    // if (descricao.length > 0 && descricao.length < 3) {
    //   controle = false;
    //   toast.error('O campo Descrição deve ter no mínimo 3 caracteres!');
    // } else if (descricao.length > 150) {
    //   controle = false;
    //   toast.error('O campo Descrição deve ter no máximo 150 caracteres!');
    // }

    return controle;
  };

  const handleIsUpdating = (comment) => {
      setCodComentario(comment.cod_comentario);
      setTexto(comment.texto);
      setUsuario(comment.usuario);
      setRespostas(comment.respostas);
      setVideo(comment.video);
      setCursosComentario(comment.video.cursos);
      setRespostasTotal(comment.respostas_total);
      setRespostasPendentes(comment.respostas_pendentes);

      setIsUpdating(true);
      setShowFormModal(true);
      setShowDeleteModal(false);
  };

  const handleIsDeleting = (vid) => {
    setCodComentario(vid.cod_video);
    setTexto(vid.titulo_video)
    setShowDeleteModal(true);
  };

  const clearSearch = () => {
    setSearchTexto('');
    setSearchCurso('');
    setSearchVideo('')
    setVideosDoCurso([]);
    loadRegisters();
  };

  const handleClose = () => {
    setShowFormModal(false);
    setShowDeleteModal(false);
    setIsUpdating(false);
    clearModal();
  };

  const clearModal = (parameter) => {
    if (!parameter) setCodComentario('');
    setTexto('');
    // setVideoCursos([]);
    // setLink('');
    // setDescricao('');
  };

  const handleOrderChange = (array, ordem) => {
    setComentarios(array)
    setSearchOrdem(ordem)
  }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  const handleCursoSearch = async(value) => {
    setSearchCurso(value)

    const querys = new URLSearchParams({
      cod_curso: value,
      status: 'ativo',
      attributtes: ['cod_video', 'titulo_video']
    }).toString();

    setIsLoading(true);
    try {
      const { data } = await axios.get(`/videos/search/${querys}`);

      setIsLoading(false);
      setVideosDoCurso(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container-body container-video">
        <h1 className="title">Gestão de comentários</h1>

        <div className='top-forms-container'>
          <div className="search-container">
            <div className="search-form">
              <div className='search-container-inputs'>
                <input
                  type="text"
                  className="search-input"
                  name="titulo"
                  placeholder="Texto do comentario"
                  value={serachTexto}
                  onChange={(e) => setSearchTexto(e.target.value)}
                />

                <select
                  name="usuario"
                  className="search-input"
                  id="Usuario"
                  value={searchUsuario}
                  onChange={(e) => setSearchUsuario(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um usuário
                  </option>
                  {usuarios.length > 0
                    ? usuarios.map((u) => (
                      <option key={`s1${u.cpf}`} value={u.cpf}>
                        {u.nome}
                      </option>
                    ))
                    : ''}
                </select>

                <select
                  name="curso"
                  className="search-input"
                  id="Curso"
                  value={searchCurso}
                  onChange={(e) => handleCursoSearch(e.target.value)}
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

                <select
                  name="video"
                  className="search-input"
                  id="video"
                  value={searchVideo}
                  disabled={(videosDoCurso.length === 0)}
                  onChange={(e) => setSearchVideo(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um vídeo
                  </option>
                  {videosDoCurso.length > 0
                    ? videosDoCurso.map((v) => (
                      <option key={`s2${v.cod_video}`} value={v.cod_video}>
                        {v.titulo_video}
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
        </div>

        <div className='container-order'>
          <OrderSelect
            handleOrderChange={handleOrderChange}
            searchOrdem={searchOrdem}
            array={comentarios} />
        </div>

        <div className='container-list'>
          {comentarios.slice(inicio, fim).map((comentario) => (
            <div
              key={`com${comentario.cod_comentario}`}
              className="list"
            >
              <div className='container-information-list'>
                <span className='cod-container-list'>{comentario.cod_comentario}</span>
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{comentario.texto.substring(1, 40)} {comentario.texto.length > 39 && '...'}</span>
                  <span className='text-laranja-100'>{comentario.respostas_pendentes} pendentes / {comentario.respostas_total} total</span>
                  <span className='text-azul-100'>  {comentario.usuario.nome}</span>
                  <span className='text-verde-100'>  {comentario.video.titulo_video}</span>
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title="Editar"
                  className='round-green-btn'
                  onClick={() => handleIsUpdating(comentario)}
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  type="button"
                  title="Excluir"
                  className='red-btn'
                  onClick={() => handleIsDeleting(comentario)}
                >
                  <TrashSimple size={20} />
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className='mt-3 ml-2'>
          {comentarios &&
            <Pagination
              total={comentarios.length}
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
            <span>Responder comentário</span>
            <button
              className="CloseModal"
              type="button"
              onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          <div className="ModalContent">
            <div className="FormInputGestao">
              {/* {isUpdating ?
                <div className="InputArea">
                  <label>Código</label>
                  <input
                    type="text"
                    className='ModalInput'
                    name="cod_video"
                    placeholder="Código"
                    disabled
                    value={codComentario}
                    onChange={(e) => setCodComentario(e.target.value)}
                  />
                </div>
              : ''} */}

              <div className="InputArea">
                <label>Título *</label>
                <input
                  type="text"
                  className='ModalInput'
                  name="texto"
                  maxLength="40"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                />
              </div>

              {/* <div className="InputArea">
                <label>Link *</label>
                <input
                  type="text"
                  className='ModalInput'
                  name="link"
                  maxLength="150"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="InputArea">
                <label>Descrição </label>
                <textarea
                  name="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div> */}

              {/* {videoCursos.length > 0 &&
                <div className="InputArea">
                  <label>Cursos</label>
                  {videoCursos.map(curso => <div key={curso.cod_curso}>{curso.nome_curso}</div>)}
                </div>
              } */}
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

        <DeleteModal
          showDeleteModal={showDeleteModal} handleClose={handleClose}
          type="comentario" name={texto} handleDelete={handleDelete} code={codComentario}
        />
      </div>
    </>
  );
}

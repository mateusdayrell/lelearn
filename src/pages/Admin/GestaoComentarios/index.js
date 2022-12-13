import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlass, PaintBrushHousehold, X, TrashSimple, ChatCircleText, ArrowBendDownRight } from 'phosphor-react';
import Modal from 'react-modal';
import { useSelector , useDispatch } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment/moment';

import './style.css';
import Loading from '../../../components/Loading';
import OrderSelect from '../../../components/OrderSelect';
import Pagination from '../../../components/Pagination';
import axios from '../../../services/axios';
import CommentArea from '../../../components/CommentArea';
import Checkbox from '../../../components/Checkbox';
import history from '../../../services/history';
import * as actions from '../../../store/modules/auth/actions';

const ITEMS_PER_PAGE = 10

export default function GestaoComentarios() {
  const dispatch = useDispatch();

  const cpf = useSelector((state) => state.auth.usuario.cpf);
  const editarResposta = useRef(null);

  const [comentarios, setComentarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [videosDoCurso, setVideosDoCurso] = useState([]);

  const [codigo, setCodigo] = useState('');
  const [texto, setTexto] = useState('');
  const [textoEditar, setTextoEditar] = useState('');
  const [ativo, setAtivo] = useState('');

  const [comentario, setComentario] = useState({});
  const [video, setVideo] = useState({});
  const [respostas, setRespostas] = useState([]);

  const [serachTexto, setSearchTexto] = useState('');
  const [searchCurso, setSearchCurso] = useState('');
  const [searchVideo, setSearchVideo] = useState('');
  const [searchUsuario, setSearchUsuario] = useState('');
  const [searchOrdem, setSearchOrdem] = useState('');
  const [searchResolvido, setSearchResolvido] = useState("0");

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState('');
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [inicio, setInicio] = useState(0)
  const [fim, setFim] = useState(ITEMS_PER_PAGE)

  useEffect(() => {
    loadRegisters();
  }, []);

  useEffect(() => {
    if (editarResposta.current) {
      editarResposta.current.focus();
    }
  }, [ativo]);

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

      if(error.response.status === 401) {
        dispatch(actions.loginFailure());
        history.push('/login');
      }
    }
  };

  const handleSearch = async () => {
    const codigosVideo = videosDoCurso.flatMap((el) => el.cod_video);
    const querys = new URLSearchParams({
      texto: serachTexto,
      videos: codigosVideo,
      cod_video: searchVideo,
      cpf: searchUsuario,
      resolvido: searchResolvido,
    }).toString();

    setIsLoading(true);

    try {
      let response = null
      if (serachTexto || searchCurso || searchVideo || searchUsuario || searchResolvido) {
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
      if(error.response.status === 401) {
        dispatch(actions.loginFailure());
        history.push('/login');
      }
    }
  };

  const handlePostComment = async () => {
    if (!validateForm()) return;

    const regTemp = {
      cpf,
      cod_video: video.cod_video,
      comentario_pai: comentario.cod_comentario,
      texto
    };

    try {
      setIsLoading(true);
      await axios.post('/comentarios', regTemp);
      setIsLoading(false);

      toast.success('Comentário postado com sucesso.');
      setTexto('');
      loadRepplyes();
    } catch (error) {
      setIsLoading(false);
      const erros = get(error, 'response.data.erros', []);
      erros.map((err) => toast.error(err));
    }
  }

  const handleUpdateComment = async (comment) => {
    if (!validateForm()) return;
    const regTemp = {
      cpf,
      cod_video: comment.cod_video,
      comentario_pai: comment.comentario_pai,
      texto: textoEditar
    };

    try {
      setIsLoading(true);
      await axios.put(`/comentarios/${comment.cod_comentario}`, regTemp);
      setIsLoading(false);

      toast.success('Comentário atualizado com sucesso.');

      setAtivo('');
      setTextoEditar('');
      loadRepplyes();
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  }

  const validateForm = () => {
    let controle = true;

    if (ativo) {
      if (!textoEditar) {
        toast.error('Comentário vazio.');
        controle = false;
      } else if (textoEditar.length < 3 || textoEditar.length > 30) {
        controle = false;
        toast.error('O comentário deve ter entre 3 e 30 caracteres');
      }
    } else if (!texto) {
      toast.error('Comentário vazio.');
      controle = false;
    } else if (texto.length < 3 || texto.length > 30) {
      controle = false;
      toast.error('O comentário deve ter entre 3 e 30 caracteres');
    }

    return controle;
  };

  const loadRepplyes = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/comentarios/${comentario.cod_comentario}`);

      setRespostas(data.respostas);
      delete data.respostas;
      delete data.video;
      setComentario(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const erros = get(error, 'response.data.erros', []);
      erros.map((err) => toast.error(err));
    }
  };

  const handleIsUpdating = (comment) => {
    if (comment) {
      setAtivo(comment.cod_comentario);
      setTextoEditar(comment.texto);
    } else {
      setAtivo('');
      setTextoEditar('');
    }
  }

  const handleDelete = async (cod) => {
    setIsLoading(true);
    try {
      await axios.delete(`/comentarios/${cod}`);

      setIsLoading(false);
      toast.success('Comentário excluído com sucesso!');

      if (isDeleting === 'resposta') await loadRepplyes();
      else await loadRegisters();
      handleClose();
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleIsAnswering = (obj) => {
    const comment = { ...obj };

    setRespostas(comment.respostas);
    setVideo(comment.video);

    delete comment.respostas;
    delete comment.video;

    setComentario(comment);
    setShowFormModal(true);
    setShowDeleteModal(false);
    setIsDeleting('');
  };

  const handleIsDeleting = (comment, type) => {
    setIsDeleting(type);
    setAtivo('');
    setCodigo(comment.cod_comentario);
    setTexto(comment.texto);
    setShowDeleteModal(true);
  };

  const clearSearch = () => {
    setSearchTexto('');
    setSearchCurso('');
    setSearchVideo('')
    setVideosDoCurso([]);
    loadRegisters();
  };

  const handleClose = async () => {
    if (isDeleting !== 'resposta') setShowFormModal(false);
    if (!isDeleting) {
      if (serachTexto || searchCurso || searchVideo || searchUsuario || searchResolvido) await handleSearch();
      else await loadRegisters();
    }
    setShowDeleteModal(false);
    clearValues();
  };

  const clearValues = () => {
    if (isDeleting === 'pai') {
      setComentario({});
      setRespostas([]);
      setVideo({});
    }
    setTexto('');
    setTextoEditar('');
    setCodigo('');
    setAtivo('');
    setIsDeleting('');
  };

  const handleOrderChange = (array, ordem) => {
    setComentarios(array)
    setSearchOrdem(ordem)
  }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  const handleCursoSearch = async (value) => {
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

  const handleResolvido = async(cod) => {
    try {
      setIsLoading(true)
      const { data } = await axios.put(`/comentarios/resolvido/${cod}`);
      setComentario(data.comentario)
      setRespostas(data.respostas)
      setIsLoading(false)
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
        <h1 className="title">Gestão de Comentários</h1>

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

                <select
                  name="resolvido"
                  className="search-input"
                  id="resolvido"
                  value={searchResolvido}
                  onChange={(e) => setSearchResolvido(e.target.value)}
                >
                  <option value="ambos">Ambos</option>
                  <option value="1">Resolvido</option>
                  <option value="0">Não resolvido</option>
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
                  className="gray-btn"
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

        <div className='ListContainerComentario'>
          {comentarios.slice(inicio, fim).map((item) => (
            <div
              key={`com${item.cod_comentario}`}
              className="ComentarioList"
            >
              <div className='BarListComentario' />
              <div className='flex flex-col h-full w-full'>
                <div className='InformationComentario'>
                  {/* <span className='cod-container-list'>{item.cod_comentatio}</span> */}
                  <span className='text-cinza-200'>{item.texto}</span>
                  <span className='flex flex-col text-xs gap-1'>
                    <span className='flex gap-2 '>
                      <span className='text-azul-100 '>{item.usuario.nome}</span>
                      <span className='text-verde-100 '>Vídeo: {item.video.titulo_video}</span>
                    </span>
                    <span className='text-laranja-100 '>{item.respostas_pendentes} Respostas pendentes <br /> {item.respostas_total} Respostas total</span>
                  </span>
                </div>

                <span className='ButtonsComentario'>
                  <button
                    type="button"
                    title="Responder"
                    className='round-green-btn'
                    onClick={() => handleIsAnswering(item)}
                  >
                    <ChatCircleText size={20} />
                  </button>
                  <button
                    type="button"
                    title="Excluir"
                    className='red-btn'
                    onClick={() => handleIsDeleting(item, 'pai')}
                  >
                    <TrashSimple size={20} />
                  </button>
                </span>
              </div>

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
              title='Fechar'
              onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          <div className="ModalContent">
            <div>
              <div>
                <p><span className='text-sm'>Vídeo:</span> <span className='text-verde-100'>{video.titulo_video}</span></p>
                <p className='text-sm'>
                  <span className='text-sm'>Cursos: </span>
                  <span className='text-laranja-100 text-xs'>{video.cursos?.map((item, i) => (<span key={item.cod_curso}>{item.nome_curso} {i < (video.cursos.length - 1) && " | "}</span>))}</span>
                </p>
              </div>
              <div className='InputArea'>
                <label className='flex items-baseline gap-2'>
                  {comentario.usuario &&
                    <div className='flex gap-10 items-center my-2'>
                      <div className='flex gap-2 items-baseline'>
                        <span className='text-base font-medium'>{comentario.usuario.nome}</span>
                        <span className='text-cinza-200 text-xs'>{moment(comentario.created_at, 'YYYY-MM-DD HH:mm:ss').format('l HH:mm:ss')}</span>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span title='Marcar como resolvido'>
                          <Checkbox
                            cId={`c-${comentario.cod_comentario}`}
                            cValue={comentario.cod_comentario}
                            handleCheckbox={handleResolvido}
                            checked={comentario.resolvido}
                          />
                        </span>
                        {comentario.resolvido ? <span>Resolvido</span> : <span className='text-vermelho-100 font-semibold'>Não resolvido</span>}
                      </div>
                    </div>
                  }
                </label>
                <div>
                  <CommentArea ativo={ativo} comentario={comentario} editarResposta={editarResposta} type="pai"
                    textoEditar={textoEditar} setTextoEditar={setTextoEditar} cpf={cpf} handleIsDeleting={handleIsDeleting}
                    handleIsUpdating={handleIsUpdating} handleUpdateComment={handleUpdateComment} />
                </div>
                <div>
                  {/* <label className='ml-1 text-cinza-100'>Responder</label> */}
                  <div className='flex items-start pr-5'>
                    <ArrowBendDownRight size={20} className='mt-1'/>
                    <textarea className='ModalInput' value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva aqui uma resposta" />
                  </div>
                  <div className='w-full flex justify-end'>
                    <button type='button' onClick={handlePostComment} className='text-xs flex items-center gap-2 py-1 px-2 my-2 text-cinza-100 bg-cinza-500 rounded-lg hover:text-verde-100 hover:bg-cinza-400 transition-all'>
                      Responder
                    </button>
                  </div>
                </div>
              </div>
              {respostas.length > 0 &&
                <div>
                  <h3>Respostas</h3>
                  <div>
                    {respostas?.map((resposta) => (
                      <div key={resposta.cod_comentario} className='InputArea pb-1'>
                        <label className='flex gap-2 items-baseline'>
                          <span>{resposta.cod_comentario} |{resposta.usuario.nome}</span>
                          <span className='text-cinza-200 text-xs'>{moment(resposta.created_at, 'YYYY-MM-DD HH:mm:ss').format('l HH:mm:ss')}</span>
                          <span className='text-cinza-200 text-xs'>{resposta.resolvido ? "Resolvido" : `Não resolvido`}</span>
                        </label>
                        <div>
                          <CommentArea ativo={ativo} comentario={resposta} editarResposta={editarResposta} type="resposta"
                            textoEditar={textoEditar} setTextoEditar={setTextoEditar} cpf={cpf} handleIsDeleting={handleIsDeleting}
                            handleIsUpdating={handleIsUpdating} handleUpdateComment={handleUpdateComment} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
            </div>
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
            <span>Excluir comentário</span>
            <button className="CloseModal" title='Fechar' type="button" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          <div className="ModalContent">
            <div className="FormDelete">
              <p>
                Deseja realmente excluir o comentário: <span className='font-semibold'>{texto}</span><br />
                Esta ação será irreversível.
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
              onClick={() => handleDelete(codigo)}
            >
              Excluir
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

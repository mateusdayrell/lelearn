import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlass, PaintBrushHousehold, X, PencilSimple, TrashSimple } from 'phosphor-react';
import Modal from 'react-modal';
import { get } from 'lodash';
import moment from 'moment/moment';

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

  const [texto, setTexto] = useState('');
  const [comentario, setComentario] = useState({});
  const [usuario, setUsuario] = useState({});
  const [video, setVideo] = useState({});
  const [respostas, setRespostas] = useState([]);


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
    setRespostas(comment.respostas);
    setUsuario(comment.usuario)
    setVideo(comment.video)
    delete comment.respostas
    delete comment.respostas
    delete comment.respostas
    setComentario(comment);
    console.log(comment);
    setIsUpdating(true);
    setShowFormModal(true);
    setShowDeleteModal(false);
  };

  const handleIsDeleting = (vid) => {
    setComentario(vid)
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
    // if (!parameter) setCodComentario('');
    // setTexto('');
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

        <div className='container-list'>
          {comentarios.slice(inicio, fim).map((item) => (
            <div
              key={`com${item.cod_comentario}`}
              className="list"
            >
              <div className='container-information-list'>
                <span className='cod-container-list'>{item.cod_comentatio}</span>
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{item.texto.substring(1, 40)} {item.texto.length > 39 && '...'}</span>
                  <span className='text-laranja-100'>{item.respostas_pendentes} pendentes / {item.respostas_total} total</span>
                  <span className='text-azul-100'>  {item.usuario.nome}</span>
                  <span className='text-verde-100'>  {item.video.titulo_video}</span>
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title="Editar"
                  className='round-green-btn'
                  onClick={() => handleIsUpdating(item)}
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  type="button"
                  title="Excluir"
                  className='red-btn'
                  onClick={() => handleIsDeleting(item)}
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
            <div>
              <div className='InputArea'>
                <label className='flex gap-5'>
                  <span>{usuario.nome}</span>
                  <span>{moment(comentario.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')}</span>
                  <span>{comentario.resolvido ? "Resolvido" : `${comentario.respostas_pendentes} respostas pendentes`}</span>
                  <span>Total respostas: {comentario.respostas_total}</span>
                </label>
                <textarea className='ModalInput' readOnly value={comentario.texto}/>
              </div>
              <div>
                <p>Vídeo: {video.titulo_video}</p>
                <p>
                  {video.cursos?.map(item => (<span key={item.cod_curso}>{item.nome_curso}</span>))}
                </p>
              </div>
              <div className='InputArea'>
              <label>Postar resposta</label>
              <textarea className='ModalInput' value={texto} onChange={(e) => setTexto(e.target.value)}/>
              </div>
              <div>
                <h3>Respostas</h3>
                <div>
                  {respostas?.map((resposta) => (
                    <div key={resposta.cod_comentario} className='InputArea'>
                      <label className='flex gap-3'>
                      <span>{resposta.usuario.nome}</span>
                      <span>{moment(resposta.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')}</span>
                      <span>{resposta.resolvido ? "Resolvido" : `Não resolvido`}</span>
                      </label>
                      <textarea className='ModalInput' readOnly value={resposta.texto}/>
                    </div>
                  ))}
                </div>
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

        <DeleteModal
          showDeleteModal={showDeleteModal} handleClose={handleClose}
          type="comentario" name={comentario.texto} handleDelete={handleDelete} code={comentario.cod_comentatio}
        />
      </div>
    </>
  );
}

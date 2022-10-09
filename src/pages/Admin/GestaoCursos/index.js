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

export default function GestaoCursos() {
  const [cursos, setCursos] = useState([]);
  const [codCurso, setCodCurso] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState(null);
  const [foto, setFoto] = useState(null)
  const [videos, setVideos] = useState([]);
  const [searchNome, setSearchNome] = useState('');
  const [showFoto, setShowFoto] = useState('')
  const itemsPerPage = 10
  const [inicio, setInicio] = useState(0)
  const [fim, setFim] = useState(itemsPerPage)
  const [searchOrdem, setSearchOrdem] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/cursos/');
      setIsLoading(false);
      setCursos(data);
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

  const handleIsUpdating = (curso) => {
    setCodCurso(curso.cod_curso);
    setNome(curso.nome_curso);
    setDescricao(curso.desc_curso);
    setVideos(curso.videos);
    setIsUpdating(true);
    setShowFormModal(true);
    if (curso.arquivo_url) setShowFoto(curso.arquivo_url)
  };

  const handleIsDeleting = (cod) => {
    setCodCurso(cod);
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

  const clearModal = () => {
    setCodCurso('');
    setNome('');
    setDescricao(null);
    setFoto(null);
    setShowFoto('')
    setVideos([]);
  };

  const handleShowFoto = (e) => {
    const file = e.target.files[0]
    const fileUrl = URL.createObjectURL(file)
    setFoto(file)
    setShowFoto(fileUrl)
  }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="container-body">
        <h1 className="title">Gestão de Cursos</h1>

        <div className="top-forms-container">
          <div className="search-container">
            <div className="search-form">

              <input
                className='search-input'
                type="text"
                name="titulo"
                placeholder="Pesquisar"
                value={searchNome}
                onChange={(e) => setSearchNome(e.target.value)}
              />

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
              key={cursos.cod_curso}
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
                  onClick={() => handleIsDeleting(curso.cod_curso)}
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
            <span>{isUpdating ? 'Editar' : 'Cadastrar'} curso</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              <X size={24}/>
            </button>
          </div>
          <div className="ModalContent">
            <div className="form-gestao-video">
              {isUpdating ? (
                <div className="ModalInput">
                  <label>Código</label>
                  <input
                    type="text"
                    name="cod_video"
                    placeholder="Código"
                    disabled
                    value={codCurso}
                    onChange={(e) => setCodCurso(e.target.value)}
                  />
                </div>
              ) : (
                ''
              )}

              <div className="ModalInput">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  maxLength="40"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Foto</label>
                <FileInput handleShowFile={handleShowFoto} foto={showFoto}/>
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

              {isUpdating ? (
                <table>
                    <thead>
                      <th>Titulo vídeo</th>
                    </thead>
                    <tbody>
                      {videos.length > 0 ? (
                        videos.map((video) => (
                          <tr key={video.cod_video}>
                            <thead>{video.titulo_video}</thead>
                          </tr>
                        ))
                      ) : (
                        <tr><td>Nenhum vídeo</td></tr>
                      )}
                    </tbody>
                  </table>
              ) : (
                ''
              )}
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
            <span>Excluir curso</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
            <X size={24}/>
            </button>
          </div>
          <div className="ModalContent">
            <div className="px-8 max-w-xl">
              <p>
                Caso prossiga com a exclusão do item, o mesmo não será mais
                recuperado. Deseja realmente excluir o curso {codCurso}?
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

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { get } from 'lodash';

import './style.css';
import axios from '../../../services/axios';
import Navbar from '../../../components/Navbar';
import Loading from '../../../components/Loading';

export default function GestaoCursos() {
  const [cursos, setCursos] = useState([]);
  const [codCurso, setCodCurso] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [videos, setVideos] = useState([]);
  const [searchNome, setSearchNome] = useState('');

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
      console.log(data);
      setIsLoading(false);
      setCursos(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      nome_curso: searchNome,
    }).toString();

    setIsLoading(true);
    try {
      const { data } = await axios.get(`/cursos/search/${querys}`);
      console.log(data);
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

    try {
      const regTemp = {
        cod_curso: codCurso,
        nome_curso: nome,
        desc_curso: descricao,
      };

      setIsLoading(true);
      if (isUpdating) {
        await axios.put(`/cursos/${codCurso}`, regTemp);
        toast.success('Curso atualizado com sucesso!');
      } else {
        await axios.post('/cursos', regTemp);
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

    if (!codCurso) {
      toast.error('Preencha o campo Código!');
      validated = false;
    }

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
    setDescricao('');
    setVideos([]);
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="gestao-curso-conatiner">
        <div className="search-container">
          <div className="search-form">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Título do vídeo"
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
            />

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
                  Nome
                </th>
                <th className="p-3 font-semibold tracking-wide text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 ">
              {cursos.map((curso) => (
                <tr
                  key={curso.cod_curso}
                  className="even:bg-gray-50 odd:bg-white hover:bg-gray-200"
                >
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                    {curso.cod_curso}
                  </td>
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                    {curso.nome_curso}
                  </td>
                  <td className="p-3 text-gray-700 text-center whitespace-nowrap flex justify-center gap-2">
                    <button
                      type="button"
                      className="round-blue-btn"
                      onClick={() => handleIsUpdating(curso)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      type="button"
                      className="round-red-btn"
                      onClick={() => handleIsDeleting(curso.cod_curso)}
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
          onClick={() => setShowFormModal(true)}
        >
          Cadastrar
        </button>

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
                value={codCurso}
                onChange={(e) => setCodCurso(e.target.value)}
              />

              <label>Nome</label>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                maxLength="40"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <label>Descrição</label>
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              {isUpdating ? (
                <>
                  <label>Vídeos</label>
                  <ul>
                    {videos.length > 0 ? (
                      videos.map((video) => (
                        <span key={video.cod_video}>
                          <li>{video.titulo_video}</li>
                        </span>
                      ))
                    ) : (
                      <span>Nenhum vídeo</span>
                    )}
                  </ul>
                </>
              ) : (
                ''
              )}
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
              x
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
            <button className="btn" type="button" onClick={handleClose}>
              Cancelar
            </button>
            <button
              className="btn"
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

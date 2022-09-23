import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { get } from 'lodash';
import Multiselect from 'react-widgets/Multiselect';

import './style.css';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import axios from '../../../services/axios';

export default function GestaoTreinamentos() {
  const [treinamentos, setTreinamentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [codTreinamento, setCodTreinamento] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [treinUsuarios, setTreinUsuarios] = useState([]);
  const [treinCursos, setTreinCursos] = useState([]);

  const [searchNome, setSearchNome] = useState('');
  const [searchUsuario, setSearchUsuario] = useState('');
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
      const treinamentosResponse = await axios.get('/treinamentos/');
      const usuariosResponse = await axios.get('/usuarios/');
      const cursosResponse = await axios.get('/cursos/');

      setIsLoading(false);

      setTreinamentos(treinamentosResponse.data);
      setUsuarios(usuariosResponse.data);
      setCursos(cursosResponse.data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      nome_treinamento: searchNome,
      cpf: searchUsuario,
      cod_curso: searchCurso,
    }).toString();

    setIsLoading(true);
    try {
      const { data } = await axios.get(`/treinamentos/search/${querys}`);
      setIsLoading(false);

      setTreinamentos(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const regTemp = {
      cod_treinamento: codTreinamento,
      nome_treinamento: nome,
      desc_treinamento: descricao,
      usuarios: treinUsuarios,
      cursos: treinCursos,
    };

    try {
      setIsLoading(true);
      if (isUpdating) {
        await axios.put(`/treinamentos/${codTreinamento}`, regTemp);

        toast.success('Treinamento atualizado com sucesso!');
      } else {
        await axios.post('/treinamentos', regTemp);
        toast.success('Treinamento cadastrado com sucesso!');
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
      await axios.delete(`/treinamentos/${codigo}`);
      setIsLoading(false);

      toast.success('Treinamento excluído com sucesso!');
      await loadRegisters();
    } catch (error) {
      setIsLoading(false);

      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const validateForm = () => {
    let controle = true;

    if (!nome) {
      toast.error('Preencha o campo Título!');
      controle = false;
    } else if (nome.length < 3 || nome.length > 30) {
      controle = false;
      toast.error('O campo Título deve ter entre 3 e 30 caracteres');
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

  const handleIsUpdating = (treinamento) => {
    setIsUpdating(true);
    setShowFormModal(true);
    setShowDeleteModal(false);

    setCodTreinamento(treinamento.cod_treinamento);
    setNome(treinamento.nome_treinamento);
    setDescricao(treinamento.desc_treinamento);
    setTreinUsuarios(treinamento.usuarios);
    setTreinCursos(treinamento.cursos);
  };

  const handleIsDeleting = (cod) => {
    setCodTreinamento(cod);
    setShowDeleteModal(true);
    setShowFormModal(false);
  };

  const clearSearch = () => {
    setSearchNome('');
    setSearchUsuario('');
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
    setCodTreinamento('');
    setNome('');
    setDescricao('');
    setTreinUsuarios([]);
    setTreinCursos([]);
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="g-video-container">
        <h1 className="title">Gestão de Treinamentos</h1>

        <div className="search-container">
          <p className="search-title">Pesquisar</p>
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              name="nome"
              placeholder="Nome do treinamento"
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
            />

            <select
              name="usuario"
              className="search-input"
              defaultValue={searchUsuario}
              onChange={(e) => setSearchUsuario(e.target.value)}
            >
              <option value="" disabled selected={searchUsuario === ''}>
                Selecione um usuário
              </option>
              {usuarios.length > 0
                ? usuarios.map((u) => (
                    <option key={u.cpf} value={u.cpf}>
                      {u.nome}
                    </option>
                  ))
                : ''}
            </select>

            <select
              name="curso"
              className="search-input"
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
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {treinamentos.map((treinamento) => (
                  <tr key={treinamento.cod_treinamento}>
                    <td className="">{treinamento.cod_treinamento}</td>
                    <td className="">{treinamento.nome_treinamento}</td>
                    <td className="">{treinamento.desc_treinamento}</td>
                    <td className="border-r-2">
                      <span className="flex justify-center gap-2">
                        <button
                          type="button"
                          className="round-blue-btn"
                          onClick={() => handleIsUpdating(treinamento)}
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          type="button"
                          className="round-red-btn"
                          onClick={() =>
                            handleIsDeleting(treinamento.cod_treinamento)
                          }
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
            <span>{isUpdating ? 'Editar' : 'Cadastrar'} treinamento</span>
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
                    name="cod_treinamento"
                    placeholder="Código"
                    disabled={!!isUpdating}
                    value={codTreinamento}
                    onChange={(e) => setCodTreinamento(e.target.value)}
                  />
                </div>
              : '' }

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
                <label>Descrição <small>(opcional)</small></label>
                <textarea
                  name="descricao"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Vincular usuários <small>(opcional)</small></label>
                <Multiselect
                  dataKey="cpf"
                  textField="nome"
                  data={usuarios}
                  defaultValue={treinUsuarios}
                  onChange={(e) => setTreinUsuarios(e)}
                />
              </div>

              <div className="ModalInput">
                <label>Vincular cursos <small>(opcional)</small></label>
                <Multiselect
                  dataKey="cod_curso"
                  textField="nome_curso"
                  data={cursos}
                  defaultValue={treinCursos}
                  onChange={(e) => setTreinCursos(e)}
                />
              </div>

              {/* <div className="ModalInput">
                <select
                  name="usuario"
                  onChange={(e) => setTreinUsuarios(e.target.value)}
                >
                  <option value="" disabled selected>
                    Selecione um usuário
                  </option>
                  {usuarios.length > 0
                    ? usuarios.map((u) => (
                        <option key={u.cpf} value={u.cpf}>
                          {u.nome}
                        </option>
                      ))
                    : ''}
                </select>
              </div>

              <div className="ModalInput">
                <select
                  name="curso"
                  onChange={(e) => setTreinCursos(e.target.value)}
                >
                  <option value="" disabled selected>
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
              </div> */}
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
            <span>Excluir Treinamento</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              x
            </button>
          </div>
          <div className="ModalContent">
            <div className="px-8 max-w-xl">
              <p>
                Caso prossiga com a exclusão do item, o mesmo não será mais
                recuperado. Deseja realmente excluir o vídeo {codTreinamento}?
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
              onClick={() => handleDelete(codTreinamento)}
            >
              Excluir
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

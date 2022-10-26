import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlass, PaintBrushHousehold, Plus, X, PencilSimple, TrashSimple } from 'phosphor-react';
import Modal from 'react-modal';
import { get } from 'lodash';
import ModalTreinamento from '../../../components/ModalTreinamento';

import './style.css';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import axios from '../../../services/axios';
import Multiselect from '../../../components/Multiselect';
import Pagination from '../../../components/Pagination';
import OrderSelect from '../../../components/OrderSelect';

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
  const [searchOrdem, setSearchOrdem] = useState('nome_treinamento asc')

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
      setSearchOrdem('nome_treinamento asc') // reserar valor do input ao pesquisar
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
      toast.error('Preencha o campo Nome!');
      controle = false;
    } else if (nome.length < 3 || nome.length > 30) {
      controle = false;
      toast.error('O campo Nome deve ter entre 3 e 30 caracteres');
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

  const handleIsUpdating = async(treinamento) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/treinamentos/${treinamento.cod_treinamento}`);
      setIsLoading(false);

      setTreinUsuarios(data.usuarios);
      setTreinCursos(data.cursos);
      setCodTreinamento(treinamento.cod_treinamento);
      setNome(treinamento.nome_treinamento);
      setDescricao(treinamento.desc_treinamento);

      setIsUpdating(true);
      setShowFormModal(true);
      setShowDeleteModal(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleIsDeleting = (treinamento) => {
    setCodTreinamento(treinamento.cod_treinamento);
    setNome(treinamento.nome_treinamento)
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

  const clearModal = (parameter) => {
    if (!parameter) setCodTreinamento('');
    setNome('');
    setDescricao('');
    setTreinUsuarios([]);
    setTreinCursos([]);
  };

  const handleMultiSelectChange = (type, obj) => {
    if (type === "usuario") {
      const newArrayUsuarios = [...treinUsuarios]

      newArrayUsuarios.push(JSON.parse(obj)) // converter string para objeto
      newArrayUsuarios.sort((a, b) => a.nome > b.nome ? 1 : -1) // ordenar por nome

      setTreinUsuarios(newArrayUsuarios)
    } else {
      const newArrayCursos = [...treinCursos]

      newArrayCursos.push(JSON.parse(obj)) // converter string para objeto
      newArrayCursos.sort((a, b) => a.nome_curso > b.nome_curso ? 1 : -1) // ordenar por nome

      setTreinCursos(newArrayCursos)
    }
  }

  const handleMultiSelectRemove = (type, cod) => {
    if (type === "usuario") {
      const newArrayUsuarios = treinUsuarios.filter(el => el.cpf !== cod); // remover obj do array
      setTreinUsuarios(newArrayUsuarios)
    }
    else {
      const newArrayCursos = treinCursos.filter(el => el.cod_curso !== cod); // remover obj do array
      setTreinCursos(newArrayCursos)
    }
  }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  const handleOrderChange = (array, ordem) => {
    setTreinamentos(array)
    setSearchOrdem(ordem)
  }

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="container-body">
        <h1 className="title">Gestão de Treinamentos</h1>

        <div className='top-forms-container'>
          <div className="search-container">
            <div className="search-form">
              <div className='search-container-inputs'>
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
                  value={searchCurso}
                  onChange={(e) => setSearchCurso(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um curso
                  </option>
                  {cursos.length > 0
                    ? cursos.map((c) => (
                      <option key={`s2${c.cod_curso}`} value={c.cod_curso}>
                        {c.nome_curso}
                      </option>
                    ))
                    : ''}
                </select>
              </div>

              <div className='search-container-buttons'>
                <button
                  className="green-btn"
                  type="button"
                  onClick={handleSearch}
                >
                  <MagnifyingGlass size={24} />
                </button>
                <button
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
            nameKey="nome_treinamento"
            handleOrderChange={handleOrderChange}
            searchOrdem={searchOrdem}
            array={treinamentos} />
        </div>

        <div className='container-list'>
          {treinamentos.slice(inicio, fim).map((treinamento) => (
            <div
              key={`trein${treinamento.cod_treinamento}`}
              className="list"
            >
              <div className='container-information-list'>
                <span className='cod-container-list'>{treinamento.cod_treinamento}</span>
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{treinamento.nome_treinamento}</span>
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title="Editar"
                  className='round-green-btn'
                  onClick={() => handleIsUpdating(treinamento)}
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  type="button"
                  title="Excluir"
                  className='red-btn'
                  onClick={() => handleIsDeleting(treinamento)}
                >
                  <TrashSimple size={20} />
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className='mt-3 ml-2'>
          {treinamentos &&
            <Pagination
              total={treinamentos.length}
              itemsPerPage={itemsPerPage}
              handleNewPage={handleNewPage} />
          }
        </div>

        {/* <Modal
          isOpen={shwoFormModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="ModalHeader">
            <span>{isUpdating ? 'Editar' : 'Cadastrar'} treinamento</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              <X size={24}/>
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
                    name="cod_treinamento"
                    placeholder="Código"
                    disabled={!!isUpdating}
                    value={codTreinamento}
                    onChange={(e) => setCodTreinamento(e.target.value)}
                  />
                </div>
                : ''}

              <div className="InputArea">
                <label>Nome</label>
                <input
                  type="text"
                  className='ModalInput'
                  name="nome"
                  placeholder="Nome"
                  maxLength="40"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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

              <div className="InputArea">
                <label>Vincular usuários <small>(opcional)</small></label>
                <Multiselect
                  type="usuario"
                  arrLista={usuarios}
                  arrSuperior={treinUsuarios}
                  value="cpf"
                  label="nome"
                  handleMultiSelectChange={handleMultiSelectChange}
                  handleMultiSelectRemove={handleMultiSelectRemove}
                />
              </div>

              <div className="InputArea">
                <label>Vincular cursos <small>(opcional)</small></label>
                <Multiselect
                  type="curso"
                  arrLista={cursos}
                  arrSuperior={treinCursos}
                  value="cod_curso"
                  label="nome_curso"
                  handleMultiSelectChange={handleMultiSelectChange}
                  handleMultiSelectRemove={handleMultiSelectRemove}
                />
              </div>

            </div>
          </div>
          <div className="ModalFooter">
            <button className="red-btn" type="button" onClick={() => clearModal("limpar")}>
              Limpar
            </button>
            <button className="green-btn" type="button" onClick={handleSubmit}>
              {isUpdating ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </Modal> */}

        <ModalTreinamento shwoFormModal={shwoFormModal} handleClose={handleClose} isUpdating={isUpdating} codTreinamento={codTreinamento} setCodTreinamento={setCodTreinamento} nome={nome} setNome={setNome} descricao={descricao} setDescricao={setDescricao} usuarios={usuarios} treinUsuarios={treinUsuarios}
  cursos={cursos} treinCursos={treinCursos} handleMultiSelectChange={handleMultiSelectChange} handleMultiSelectRemove={handleMultiSelectRemove} clearModal={clearModal} handleSubmit={handleSubmit} />

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
                recuperado. Deseja realmente excluir o treinamento {nome}?
              </p>
            </div>
          </div>
          <div className="ModalFooter">
            <button
              className="bg-cinza-300 text-white w-24 py-2 rounded-xl hover:bg-gray-500"
              type="button"
              onClick={handleClose}>
              Cancelar
            </button>
            <button
              className="bg-vermelho-100 text-white w-24 py-2 rounded-xl hover:bg-vermelho-200"
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

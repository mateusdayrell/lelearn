import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlass, X, PaintBrushHousehold, Plus, PencilSimple, TrashSimple, Eye, MinusCircle } from 'phosphor-react';
import Modal from 'react-modal';
import { get } from 'lodash';
// import ModalTreinamento from '../../../components/ModalTreinamento';

import './style.css';
import Loading from '../../../components/Loading';
import axios from '../../../services/axios';
import Pagination from '../../../components/Pagination';
import OrderSelect from '../../../components/OrderSelect';
import Multiselect from '../../../components/Multiselect';
import DeleteModal from '../../../components/DeleteModal';

export default function GestaoTreinamentos() {
  const [treinamentos, setTreinamentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [codTreinamento, setCodTreinamento] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState('');
  const [treinUsuarios, setTreinUsuarios] = useState([]);
  const [treinCursos, setTreinCursos] = useState([]);
  const [deleted, setDeleted] = useState(false)

  const [searchNome, setSearchNome] = useState('');
  const [searchUsuario, setSearchUsuario] = useState('');
  const [searchCurso, setSearchCurso] = useState('');
  const [searchOrdem, setSearchOrdem] = useState('nome_treinamento asc')
  const [searchStatus, setSearchStatus] = useState('ativo');

  const [isLoading, setIsLoading] = useState(false);
  const [shwoFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [form, setForm] = useState(0)
  const selected = 'bg-transparent hover:bg-transparent shadow-none text-sm p-0 mt-3 text-cinza-100 hover:text-cinza-300 transition-all'

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
      status: searchStatus,
    }).toString();

    setIsLoading(true);
    try {
      let response = null
      if (searchNome || searchUsuario || searchCurso || searchStatus !== 'ativo') {
        response = await axios.get(`/treinamentos/search/${querys}`);
      } else {
        response = await axios.get('/treinamentos/');
      }
      setIsLoading(false);

      setTreinamentos(response.data);
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
      cor,
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

      if (deleted) toast.success('Treinamento excluído com sucesso!');
      else toast.success('Treinamento desativado com sucesso!');

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

    if (descricao && descricao.length > 0 && descricao.length < 3) {
      controle = false;
      toast.error('O campo Descrição deve ter no mínimo 3 caracteres!');
    } else if (descricao && descricao.length > 150) {
      controle = false;
      toast.error('O campo Descrição deve ter no máximo 150 caracteres!');
    }

    return controle;
  };

  const handleIsUpdating = async (treinamento) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/treinamentos/${treinamento.cod_treinamento}`);
      setIsLoading(false);

      setTreinUsuarios(data.usuarios);
      setTreinCursos(data.cursos);
      setCor(data.cor)
      setCodTreinamento(treinamento.cod_treinamento);
      setNome(treinamento.nome_treinamento);
      setDescricao(treinamento.desc_treinamento);
      setDeleted(!!treinamento.deleted_at);

      setIsUpdating(true);
      setShowFormModal(true);
      setForm(0);
      setShowDeleteModal(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleIsDeleting = (treinamento) => {
    setCodTreinamento(treinamento.cod_treinamento);
    setNome(treinamento.nome_treinamento);
    setDeleted(!!treinamento.deleted_at);
    setShowDeleteModal(true);
    setShowFormModal(false);
  };

  const clearSearch = () => {
    setSearchNome('');
    setSearchUsuario('');
    setSearchCurso('');
    setSearchStatus('ativo')
    loadRegisters();
  };

  const handleClose = () => {
    setShowFormModal(false);
    setForm(0)
    setShowDeleteModal(false);
    setIsUpdating(false);
    clearModal();
  };

  const clearModal = () => {
    setCodTreinamento('');
    setNome('');
    setDescricao('');
    setCor('');
    setTreinUsuarios([]);
    setTreinCursos([]);
    setDeleted(false);
  };

  const clearFormModal = () => {
    if (form === 0) {
      setNome('');
      setDescricao('');
    }
    if (form === 1) setTreinUsuarios([]);
    if (form === 2) setTreinCursos([]);
  }

  const handleNewPage = (novoInicio, novoFim) => {
    setInicio(novoInicio)
    setFim(novoFim)
  }

  const handleOrderChange = (array, ordem) => {
    setTreinamentos(array)
    setSearchOrdem(ordem)
  }

  const handleActivate = async (cod) => {
    try {
      setIsLoading(true);
      await axios.put(`/treinamentos/activate/${cod}`);

      setIsLoading(false);
      toast.success('Treinamento ativado com sucesso.');

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

              <div className='search-container-buttons'>
                <button
                  title='Pesquisar'
                  className="green-btn"
                  type="button"
                  onClick={handleSearch}
                >
                  <MagnifyingGlass size={24} />
                </button>
                <button
                  title='Limpar campos'
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
              title='Cadastrar treinamento'
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
                {/* <span className='cod-container-list'>{treinamento.cod_treinamento}</span> */}
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{treinamento.nome_treinamento}</span>
                  <span className={treinamento.deleted_at ? 'subname-container-list-red' : 'hidden'}>
                    <small>{treinamento.deleted_at ? 'Treinamento desativado' : ''}</small>
                  </span>
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title={treinamento.deleted_at ? "Visualizar" : "Editar"}
                  className={treinamento.deleted_at ? 'round-blue-btn':'round-green-btn'}
                  onClick={() => handleIsUpdating(treinamento)}
                >
                  {treinamento.deleted_at
                    ? <Eye size={20} />
                    : <PencilSimple size={20} />
                  }
                </button>
                <button
                  type="button"
                  title={treinamento.deleted_at ? "Excluir" : "Desativar"}
                  className='red-btn'
                  onClick={() => handleIsDeleting(treinamento)}
                >
                  {treinamento.deleted_at
                    ? <TrashSimple size={20} />
                    : <MinusCircle size={20} />
                  }
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

        <Modal
          isOpen={shwoFormModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}>

          <div className="ModalHeader">
            {/* eslint-disable-next-line no-nested-ternary */}
            <span>{isUpdating ? deleted ? 'Visualizar' : 'Editar' : 'Cadastrar'} treinamento <i>{nome}</i></span>
            <button className="CloseModal" title='Fechar' type="button" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>

          <div className='ContentBtnsLists'>
            <button
              type='button'
              className={(form === 0) ? `${selected}` : "BtnModal"}
              onClick={() => setForm(0)}>
              Treinamento
            </button>

            <div className='BarBtnsLists' />

            <button
              type="button"
              className={form === 2 ? `${selected}` : "BtnModal"}
              onClick={() => setForm(2)}>
              Cursos
            </button>

            <div className='BarBtnsLists' />

            <button
              type="button"
              className={form === 1 ? `${selected}` : "BtnModal"}
              onClick={() => setForm(1)}>
              Usuários
            </button>
          </div>

          {form === 0 &&
            <div className="ModalContent">
              <div className="FormInputGestao">

                {/* {isUpdating ?
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
                : ''} */}

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

                <div className="InputArea">
                  <label>Cor do card *</label>
                  <select
                    name="cor"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)} >
                    <option value="" disabled>
                      Selecione uma cor
                    </option>
                    <option className='text-azul-100' value="#81D8F7"> Azul</option>
                    <option className='text-verde-100' value="#00B37E"> Verde</option>
                    <option className='text-cinza-100' value="#F3F4F6"> Branco</option>
                    <option className='text-vermelho-100' value="#F75A68">Vermelho</option>
                    <option className='text-roxo-100' value="#633BBC"> Roxo</option>
                  </select>
                </div>

                <div className="InputArea">
                  <label>Descrição</label>
                  <textarea
                    name="descricao"
                    disabled={deleted}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>

                {!deleted && <p className='InformationP'><i>Campos com ( * ) devem ser preenchidos obrigatoriamente.</i></p>}
              </div>
            </div>
          }

          {form === 1 &&
            <div className="ModalContent">

              {!deleted && <p className='text-sm my-4 pl-1 text-cinza-100'>Vincule os usuários que irão fazer este treinamento. A definição de prazo para os usuários é opcional.</p>}

              <div className="InputArea">
                <label>{deleted ? 'Usuários' : 'Vincular usuários'}</label>
                <Multiselect
                  type="usuário"
                  listaArr={usuarios}
                  array={treinUsuarios}
                  setArray={setTreinUsuarios}
                  value="cpf"
                  label="nome"
                  deleted={deleted}
                />
              </div>
            </div>
          }

          {form === 2 &&
            <div className="ModalContent">

              {!deleted && <p className='text-sm my-4 pl-1 text-cinza-100'>Vincule os cursos que estarão disponíveis no treinamento.</p>}

              <div className="InputArea">
                <label>{deleted ? 'Cursos' : 'Vincular cursos'}</label>
                <Multiselect
                  type="curso"
                  listaArr={cursos}
                  array={treinCursos}
                  setArray={setTreinCursos}
                  value="cod_curso"
                  label="nome_curso"
                  deleted={deleted}
                />
              </div>
            </div>
          }

          {deleted
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
                onClick={() => handleActivate(codTreinamento)}>
                Ativar
              </button>
            </div>
            :
            <div className="ModalFooter">
              <button className="RedBtn" type="button" onClick={() => clearFormModal()}>
                Limpar
              </button>
              <button className="GreenBtn" type="button" onClick={handleSubmit}>
                {isUpdating ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          }
        </Modal>

        <DeleteModal
          showDeleteModal={showDeleteModal} handleClose={handleClose} deleted={deleted}
          type="treinamento" name={nome} handleDelete={handleDelete} code={codTreinamento}
        />
      </div>
    </>
  );
}

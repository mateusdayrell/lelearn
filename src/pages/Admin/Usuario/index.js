import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { MagnifyingGlass, PaintBrushHousehold, Plus, X, PencilSimple, TrashSimple, CloudArrowUp } from 'phosphor-react';
import Modal from 'react-modal';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { isEmail, isMobilePhone } from 'validator';
import InputMask from 'react-input-mask';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import OrderSelect from '../../../components/OrderSelect';
import Pagination from '../../../components/Pagination';
import './style.css';

export default function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormModal, setShowFromModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipo, setTipo] = useState('');

  const [searchNome, setSearchNome] = useState('');
  const [searchCpf, setSearchCpf] = useState('');
  const [searchTipo, setSearchTipo] = useState('');
  const [searchOrdem, setSearchOrdem] = useState('')

  const itemsPerPage = 10
  const [inicio, setInicio] = useState(0)
  const [fim, setFim] = useState(itemsPerPage)

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/usuarios/');

      setIsLoading(false);
      setUsuarios(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      cpf: searchCpf,
      nome: searchNome,
      tipo: searchTipo,
    }).toString();

    setIsLoading(true);
    try {
      let response = null;

      if (searchCpf || searchNome || searchTipo) {
        response = await axios.get(`/usuarios/search/${querys}`);
      } else {
        response = await axios.get('/usuarios/');
      }

      setIsLoading(false);
      setUsuarios(response.data);
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
      let regTemp = {
        cpf,
        nome,
        email,
        telefone: telefone.replace(/\D/g, ''),
        tipo,
      };

      if (password) {
        regTemp = { ...regTemp, password };
      }

      setIsLoading(true);
      if (isUpdating) {
        await axios.put(`/usuarios/${cpf}`, regTemp);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await axios.post('/usuarios', regTemp);
        toast.success('Usuário cadastrado com sucesso!');
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

  const handleDelete = async (cpfUsuario) => {
    handleClose();
    setIsLoading(true);
    try {
      await axios.delete(`/usuarios/${cpfUsuario}`);

      setIsLoading(false);
      toast.success('Usuário excluído com sucesso!');
      await loadRegisters();
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleIsUpdating = (usuario) => {
    setCpf(usuario.cpf);
    setNome(usuario.nome);
    setTelefone(usuario.telefone);
    setEmail(usuario.email);
    setPassword('');
    setConfirmPassword('');
    setTipo(usuario.tipo);
    setShowFromModal(true);
    setIsUpdating(true);
  };

  const handleIsDeleting = (usuario) => {
    setCpf(usuario.cpf);
    setNome(usuario.nome)
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    let controle = true;

    const telefoneFormatado = telefone.replace(/\D/g, '')

    if (!cpf) {
      toast.error('Preencha o campo CPF!');
      controle = false;
    } else if (!cpfValidator.isValid(cpf)) {
      toast.error('CPF inválido!');
      controle = false;
    }

    if (!nome) {
      toast.error('Preencha o campo Nome!');
      controle = false;
    } else if (nome.length < 3) {
      toast.error('O campo Nome deve ter no mínimo 3 caracteres!');
      controle = false;
    } else if (nome.length > 40) {
      toast.error('O campo Nome deve ter no máximo 40 caracteres!');
      controle = false;
    }

    if (telefoneFormatado && (telefoneFormatado.length < 10 || telefoneFormatado.length > 11)) {
      toast.error('O campo telefone deve ter 10 ou 11 caracteres!');
      controle = false;
    } else if (telefoneFormatado && !isMobilePhone(telefoneFormatado, 'pt-BR')) {
      toast.error('Telefone inválido!');
      controle = false;
    }

    if (!email) {
      controle = false;
      toast.error('Preencha o campo Email!');
    } else if (!isEmail(email)) {
      toast.error('Email inválido!');
      controle = false;
    } else if (email.length > 50) {
      toast.error('O campo Email deve ter no máximo 50 caracteres!');
      controle = false;
    }

    if (!isUpdating) {
      if (!password) {
        controle = false;
        toast.error('Preencha o campo Senha!');
      } else if (!confirmPassword) {
        toast.error('Preencha o campo Confirmar senha!');
        controle = false;
      } else if (password.length < 8) {
        toast.error('A senha deve ter no mínimo 8 caracteres!');
        controle = false;
      } else if (password !== confirmPassword) {
        toast.error('As senhas não coincidem!');
        controle = false;
      } else if (password.length > 30) {
        toast.error('O campo senha deve ter no máximo 30 caracteres!');
        controle = false;
      }
    }

    return controle;
  };

  const clearModal = (parameter) => {
    if (!parameter) setCpf('');
    setNome('');
    setTelefone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTipo('');
  };

  const clearSearch = () => {
    setSearchCpf('');
    setSearchNome('');
    setSearchTipo('');
    loadRegisters();
  };

  const handleClose = () => {
    setShowFromModal(false);
    setShowDeleteModal(false);
    setIsUpdating(false);
    clearModal();
  };

  const handleOrderChange = (array, ordem) => {
    setUsuarios(array)
    setSearchOrdem(ordem)
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
        <h1 className="title">Gestão de Usuários</h1>

        <div className='top-forms-container'>
          <div className="search-container">
            <div className="search-form">
              <div className='search-container-inputs'>
                <input
                  id="cpf-search"
                  type="text"
                  className="search-input"
                  name="cpf"
                  placeholder="CPF"
                  value={cpfValidator.format(searchCpf)}
                  maxLength={11}
                  onChange={(e) => setSearchCpf(e.target.value)}
                />

                <input
                  className="search-input"
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={searchNome}
                  onChange={(e) => setSearchNome(e.target.value)}
                />

                <select
                  className="search-input"
                  name="tipo"
                  id="tipo"
                  value={searchTipo}
                  onChange={(e) => setSearchTipo(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um tipo
                  </option>
                  <option value="0">Administrador</option>
                  <option value="1">Usuário comum</option>
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
          <span className='search-container-cadastrar'>
            <button
              title="Cadastrar"
              className="green-btn"
              type="button"
              onClick={() => setShowFromModal(true)}
            >
              <Plus size={24} />
            </button>
          </span>
        </div>

        <div className='container-order'>
          <OrderSelect
            nameKey="nome"
            handleOrderChange={handleOrderChange}
            searchOrdem={searchOrdem}
            array={usuarios} />
        </div>

        <div className='container-list'>
          {usuarios.slice(inicio, fim).map((usuario) => (
            <div
              key={usuario.cpf}
              className="list"
            >
              <div className='container-information-list'>
                <span className='cpf-container-list'>{cpfValidator.format(usuario.cpf)}</span>
                <div className='bar-container-list' />
                <span className='name-container-list'>
                  <span>{usuario.nome}</span>
                  <span className={usuario.tipo === 0 ? 'subname-container-list-blue' : 'text-sm text-laranja-100 rounded-xl px-1 pb-[2px] ml-3 bg-[#6d4b24]'}>
                    <small>{usuario.tipo === 0 ? 'Administrador' : 'Comum'}</small>
                  </span>
                </span>
              </div>

              <span className='buttons-container-list'>
                <button
                  type="button"
                  title="Editar"
                  className='round-green-btn'
                  onClick={() => handleIsUpdating(usuario)}
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  type="button"
                  title="Excluir"
                  className='red-btn'
                  onClick={() => handleIsDeleting(usuario)}
                >
                  <TrashSimple size={20} />
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className='mt-3 ml-2'>
          {usuarios &&
            <Pagination
              total={usuarios.length}
              itemsPerPage={itemsPerPage}
              handleNewPage={handleNewPage} />
          }
        </div>


        <Modal
          isOpen={showFormModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="ModalHeader">
            <span>{isUpdating ? 'Editar' : 'Cadastrar'} usuário</span>
            <button
              className="CloseModal"
              type="button"
              onClick={handleClose}>
              <X size={24} />
            </button>
          </div>


          <div className="ModalContent">
            <div className='FormInput'>
              <div className="InputArea">
                <label>CPF</label>
                <input
                  id="cpf"
                  type="text"
                  className='ModalInput'
                  name="cpf"
                  value={cpfValidator.format(cpf)}
                  maxLength={11}
                  disabled={!!isUpdating}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>

              <div className='ModalBar'></div>

              <div className="InputArea">
                <label>Telefone (Opcional)</label>
                <InputMask
                  mask="(99) 9 9999-9999"
                  value={telefone}
                  type="text"
                  className='ModalInput'
                  name="telefone"
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
            </div>

            <div className="InputArea">
              <label>Nome</label>
              <input
                type="text"
                className='ModalInput'
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="InputArea">
              <label>Email</label>
              <input
                type="email"
                className='ModalInput'
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='FormInput'>
              <div className="InputArea">
                <label>Senha</label>
                <input
                  type="password"
                  className='ModalInput'
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className='ModalBar'></div>

              <div className="InputArea">
                <label>Confirmar senha</label>
                <input
                  type="password"
                  className='ModalInput'
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="InputArea w-1/2">
              <label>Tipo</label>
              <select
                name="tipo"
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="" disabled>
                  Selecione um tipo
                </option>
                <option value="0">Administrador</option>
                <option value="1">Usuário comum</option>
              </select>
            </div>
          </div>

          <div className="ModalFooter">
            <button
              className="RedBtn"
              type="button"
              onClick={() => clearModal("limpar")}>
              Limpar
            </button>
            <button
              className="GreenBtn"
              type="submit"
              onClick={handleSubmit}>
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
            <span>Excluir usuário</span>
            <button
              className="CloseModal"
              title="Fechar modal"
              type="button"
              onClick={handleClose}>
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
                Deseja realmente excluir o usuário <i>{nome}</i> ?
              </p>
            </div>
          </div>
          <div className="ModalFooter">
            <button
              className="GrayBtn"
              type="button"
              onClick={handleClose} >
              Cancelar
            </button>
            <button
              className="RedBtn"
              type="button"
              onClick={() => handleDelete(cpf)}
            >
              Excluir
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

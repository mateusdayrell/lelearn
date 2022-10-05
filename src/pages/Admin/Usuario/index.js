import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { MagnifyingGlass, PaintBrushHousehold, Plus } from 'phosphor-react';
import Modal from 'react-modal';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { isEmail, isMobilePhone } from 'validator';
import InputMask from 'react-input-mask';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import OrderSelect from '../../../components/OrderSelect';
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

  const handleIsDeleting = (cod) => {
    setCpf(cod);
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

  const clearModal = () => {
    setCpf('');
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
  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />

      <div className="container-body">
        <h1 className="title">Gestão de Usuários</h1>

        <div className='top-forms-container'>
          <div className="search-container">
            {/* <p className="search-title">Pesquisar</p> */}
            <div className="search-form">
              <input
                className="search-input"
                type="text"
                name="cpf"
                placeholder="CPF"
                value={searchCpf}
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
                defaultValue={searchTipo}
                onChange={(e) => setSearchTipo(e.target.value)}
              >
                <option value="" disabled selected={searchTipo === ''}>
                  Selecione um tipo
                </option>
                <option value="0">Administrador</option>
                <option value="1">Usuário comum</option>
              </select>

              <div className="flex gap-3">
              <button
                    title="Pesquisar"
                    className="round-green-btn"
                    type="button"
                    onClick={handleSearch}
                  >
                    <MagnifyingGlass size={22} />
                  </button>
                  <button
                    title="Limpar campos"
                    className="red-btn"
                    type="button"
                    onClick={clearSearch}>
                    <PaintBrushHousehold size={22} />
                  </button>
              </div>
            </div>
          </div>
          <span className='flex justify-center items-center w-1/4'>
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

        <div className='mt-4 mb-8 ml-2'>
          <OrderSelect
            nameKey="nome"
            handleOrderChange={handleOrderChange}
            searchOrdem={searchOrdem}
            array={usuarios} />
        </div>

        <div className='text-[#d1d7e1]'>
        {usuarios.map((usuario) => (
          <div
            key={usuario.cpf}
            className="w-full shadow-md shadow-zinc-700 rounded-lg py-4 pl-6 pr-8 mb-3 bg-[#323238] flex justify-between items-center"
          >
            <span>
              <span className='border-r-2 py-2 pr-3 border-verde-100'>{cpfValidator.format(usuario.cpf)}</span>
              <span className='pl-3'>{usuario.nome}</span>
              <span className={usuario.tipo === 0 ? 'text-sm text-azul-100 rounded px-1 pb-[2px] ml-3': 'text-sm text-laranja-100 rounded px-1 pb-[2px] ml-3'}>
                <small>{usuario.tipo === 0 ? 'Administrador' : 'Comum'}</small>
              </span>
            </span>

            <span className='flex gap-5'>
              <button
                type="button"
                title="Editar"
                className='round-green-btn'
                onClick={() => handleIsUpdating(usuario)}
              >
                <FaPencilAlt/>
              </button>
              <button
                type="button"
                title="Excluir"
                className='red-btn'
                onClick={() => handleIsDeleting(usuario.cpf)}
              >
                <FaTrashAlt />
              </button>
            </span>
          </div>
        ))}
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
              title="Fechar modal"
              onClick={handleClose}>
              x
            </button>
          </div>
          <div className="ModalContent">
            <div className="form-usuario">
              <div className="ModalInput">
                <label>CPF</label>
                <input
                  id="cpf"
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={cpfValidator.format(cpf)}
                  maxLength={11}
                  disabled={!!isUpdating}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Telefone</label>
                <InputMask
                  mask="(99) 9 9999-9999"
                  value={telefone}
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>



              <div className="ModalInput">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Senha</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Confirmar senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="ModalInput">
                <label>Tipo</label>
                <select
                  name="tipo"
                  id="tipo"
                  defaultValue={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="" disabled selected>
                    Selecione um tipo
                  </option>
                  <option value="0">Administrador</option>
                  <option value="1">Usuário comum</option>
                </select>
              </div>
            </div>
          </div>
          <div className="ModalFooter">
            <button
              className="bg-vermelho-100 text-white w-24 py-2 rounded-xl hover:bg-vermelho-200"
              title="Limpar campos"
              type="button"
              onClick={clearModal}>
              Limpar
            </button>
            <button
              className="bg-verde-100 text-white w-24 py-2 rounded-xl hover:bg-verde-200"
              title={isUpdating ? 'Atualizar dados' : 'Salvar dados'}
              type="submit"
              onClick={handleSubmit}>
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
            <span>Excluir usuário</span>
            <button
              className="CloseModal"
              title="Fechar modal"
              type="button"
              onClick={handleClose}>
              x
            </button>
          </div>
          <div className="ModalContent">
            <div className="px-8 max-w-xl">
              <p>
                Caso prossiga com a exclusão do item, o mesmo não será mais
                recuperado.
                <br /> Deseja realmente excluir o usuário de CPF{' '}
                {cpfValidator.format(cpf)}?
              </p>
            </div>
          </div>
          <div className="ModalFooter">
            <button
             className="bg-verde-100 text-white w-24 py-2 rounded-xl hover:bg-verde-200"
             title="Cancelar"
             type="button"
             onClick={handleClose} >
              Cancelar
            </button>
            <button
              className="bg-vermelho-100 text-white w-24 py-2 rounded-xl hover:bg-vermelho-200"
              title="Excluir"
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

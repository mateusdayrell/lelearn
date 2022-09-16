import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import Modal from 'react-modal';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { isEmail, isMobilePhone } from 'validator';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
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
  const [dataNasc, setDataNasc] = useState('');

  const [searchNome, setSearchNome] = useState('');
  const [searchCpf, setSearchCpf] = useState('');
  const [searchTipo, setSearchTipo] = useState('');

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
        telefone,
        tipo,
        data_nasc: dataNasc,
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
    setDataNasc(moment(usuario.data_nasc).format('YYYY-MM-DD'));
    setShowFromModal(true);
    setIsUpdating(true);
  };

  const handleIsDeleting = (cod) => {
    setCpf(cod);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    let controle = true;

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

    if (telefone && (telefone.length < 10 || telefone.length > 11)) {
      toast.error('O campo telefone deve ter 10 ou 11 caracteres!');
      controle = false;
    } else if (telefone && !isMobilePhone(telefone, 'pt-BR')) {
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
    setDataNasc('');
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

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />

      <div className="container-usuario">
        <div className="search-container">
          <div className="search-form">
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={searchCpf}
              onChange={(e) => setSearchCpf(e.target.value)}
            />

            <label>Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
            />

            <label>Tipo</label>
            <select
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

        <div className="usuario-content">
          <div className="overflow-auto rounded-lg shadow-xl">
            <table className="w-full border-separate">
              <thead className="bg-gray-100 border-b-2 border-gray-200 ">
                <tr>
                  <th className="min-w-36 p-3 font-semibold tracking-wide text-center">
                    CPF
                  </th>
                  <th className="p-3 font-semibold tracking-wide text-center">
                    Nome
                  </th>
                  <th className="min-w-48 p-3 font-semibold tracking-wide text-center">
                    Tipo
                  </th>
                  <th className="min-w-48 p-3 font-semibold tracking-wide text-center">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 ">
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.cpf}
                    className="even:bg-gray-50 odd:bg-white hover:bg-gray-200"
                  >
                    <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                      {cpfValidator.format(usuario.cpf)}
                    </td>
                    <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                      {usuario.nome}
                    </td>
                    <td className="p-3 text-gray-700 text-center whitespace-nowrap">
                      {usuario.tipo === 0 ? 'Administrador' : 'Usuário comum'}
                    </td>
                    <td className="p-3 text-gray-700 text-center whitespace-nowrap flex justify-center gap-2">
                      <button
                        type="button"
                        className="round-blue-btn"
                        onClick={() => handleIsUpdating(usuario)}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        type="button"
                        className="round-red-btn"
                        onClick={() => handleIsDeleting(usuario.cpf)}
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
            onClick={() => setShowFromModal(true)}
          >
            Cadastrar
          </button>
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
            <button className="CloseModal" type="button" onClick={handleClose}>
              x
            </button>
          </div>
          <div className="ModalContent">
            <div className="form-usuario">
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
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                maxLength={11}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Senha</label>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Confirmar senha</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
              <label>Data Nascimento</label>
              <input
                type="date"
                value={dataNasc}
                onChange={(e) =>
                  setDataNasc(
                    moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY')
                  )
                }
              />
            </div>
          </div>
          <div className="ModalFooter">
            <button className="btn" type="button" onClick={clearModal}>
              Limpar
            </button>
            <button className="btn" type="submit" onClick={handleSubmit}>
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
            <button className="CloseModal" type="button" onClick={handleClose}>
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
            <button className="btn" type="button" onClick={handleClose}>
              Cancelar
            </button>
            <button
              className="btn"
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

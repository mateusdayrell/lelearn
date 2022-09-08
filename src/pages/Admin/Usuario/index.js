import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import Modal from 'react-modal';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import Navbar from '../../../components/Navbar';
import './style.css';

export default function AdmUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataNasc, setDataNasc] = useState('');

  const [searchNome, setSearchNome] = useState('');
  const [searchCpf, setSearchCpf] = useState('');
  const [searchTipo, setSearchTipo] = useState('');

  const [cpfAntigo, setCpfAntigo] = useState('');

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
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
      getUsuarios();
    } catch (error) {
      setIsLoading(false);
      const erros = get(error, 'response.data.erros', []);
      erros.map((err) => toast.error(err));
    }
  };

  const handleUpdate = (usuario) => {
    setCpf(usuario.cpf);
    setCpfAntigo(usuario.cpf);
    setNome(usuario.nome);
    setTelefone(usuario.telefone);
    setEmail(usuario.email);
    setPassword('');
    setTipo(usuario.tipo);
    setDataNasc(moment(usuario.data_nasc).format('YYYY-MM-DD'));
    setShowModal(true);
    setIsUpdating(true);
  };

  const clearModal = () => {
    setCpf('');
    setCpfAntigo('');
    setNome('');
    setTelefone('');
    setEmail('');
    setPassword('');
    setTipo('');
    setDataNasc('');
  };

  const clearSearch = () => {
    setSearchCpf('');
    setSearchNome('');
    setSearchTipo('');
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setIsUpdating(false);
    clearModal();
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />

      <div className='container-usuario'>

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
                <option value="" disabled selected>
                  Selecione um tipo
                </option>
                <option value="0">Administrador</option>
                <option value="1">Usuário comum</option>
              </select>

              <div className="buttons">
                <button className='btn' type="button" onClick={getUsuarios}>
                  Pesquisar
                </button>
                <button className='btn' type="button" onClick={() => clearSearch(getUsuarios())}>
                  Limpar
                </button>
              </div>
          </div>
        </div>

        <div className="usuario-content">
          <div className='overflow-auto rounded-lg shadow-xl'>
            <table className='w-full border-separate'>
              <thead className='bg-gray-100 border-b-2 border-gray-200 '>
                <tr>
                  <th className='min-w-36 p-3 font-semibold tracking-wide text-center'>CPF</th>
                  <th className='p-3 font-semibold tracking-wide text-center'>Nome</th>
                  <th className='min-w-48 p-3 font-semibold tracking-wide text-center'>Tipo</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-800 '>
                {usuarios.map((usuario) => (
                  <tr key={usuario.cpf} onClick={() => handleUpdate(usuario)} className='even:bg-gray-50 odd:bg-white hover:bg-gray-200'>
                    <td className='p-3 text-gray-700 text-center whitespace-nowrap'>{usuario.cpf}</td>
                    <td className='p-3 text-gray-700 text-center whitespace-nowrap'>{usuario.nome}</td>
                    <td className='p-3 text-gray-700 text-center whitespace-nowrap'>
                      {usuario.tipo === 0 ? 'Administrador' : 'Usuário comum'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className='btn mx-auto my-5' type="button" onClick={handleShow}>Cadastrar</button>
        </div>

          <Modal isOpen={showModal} onRequestClose={handleClose} className="modal">
            <div className="form-usuario">
              {isUpdating ? (
                <>

                  <label htmlFor="cpfAntigo">CPF antigo</label>
                  <input
                    id="cpfAntigo"
                    name="cpfAntigo"
                    disabled
                    placeholder="cpf"
                    value={cpfAntigo}
                  />
                  <br />
                </>
              ) : (
                ''
              )}
              <label>CPF</label>
              <input
                id="cpf"
                type="text"
                name="cpf"
                placeholder="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <br />
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                placeholder="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <br />
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                placeholder="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <br />
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <label>Senha</label>
              <input
                type="password"
                name="password"
                placeholder="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
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
              <br />
              <label>Data Nascimento</label>
              <input
                type="date"
                value={dataNasc}
                // eslint-disable-next-line prettier/prettier
                  onChange={(e) => setDataNasc(moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY'))}
              />

                <div className='buttons'>
                  <button className='btn' type="button" onClick={clearModal}>
                    Limpar
                  </button>
                  <button className='btn' type="submit" onClick={handleSubmit}>
                    {isUpdating ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </div>
        </Modal>

      </div>
    </>
  );
}

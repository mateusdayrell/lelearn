import React, { useEffect, useState } from 'react';
import { Table, Modal } from 'react-bootstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import { get } from 'lodash';

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

  const [cpfAntigo, setCpfAntigo] = useState('');

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/usuarios');
      setIsLoading(false);
      setUsuarios(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleSubmit = async (e) => {
    console.log(1111111);
    e.preventDefault();
    try {
      console.log({
        cpf,
        nome,
        email,
        telefone,
        password,
        tipo,
        data_nasc: dataNasc,
      });
      setIsLoading(true);

      if (isUpdating) {
        console.log('entrou');
        await axios.put(`/usuarios/${cpf}`, {
          cpf,
          nome,
          email,
          telefone,
          password,
          tipo,
          data_nasc: dataNasc,
        });
      } else {
        console.log('cadastro');
        await axios.post('/usuarios', {
          cpf,
          nome,
          email,
          telefone,
          password,
          tipo,
          data_nasc: dataNasc,
        });
      }

      setIsLoading(false);
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
    // console.log(moment(usuario.data_nasc).format('YYYY-MM-DD'));
  };

  const clearModal = () => {
    setIsUpdating(false);
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    // clearModal();
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <h1>Usuários</h1>
      <div className="container">
        <Table hover>
          <thead>
            <tr>
              <th>CPF</th>
              <th>Nome</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.cpf} onClick={() => handleUpdate(usuario)}>
                <td>{usuario.cpf}</td>
                <td>{usuario.nome}</td>
                <td>
                  {usuario.tipo === 0 ? 'Administrador' : 'Usuário comum'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <button type="button" onClick={handleShow}>
          Cadastrar
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isUpdating ? `Atualizar os dados de ${nome}` : 'Cadastrar usuário'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="form-usuario">
            <div>
              {isUpdating ? (
                <>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
              <label>Cpf</label>
              <input
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
              <input
                type="numeric"
                name="tipo"
                placeholder="0 ou 1"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
              <br />
              <label>Data Nascimento</label>
              <input
                type="date"
                value={dataNasc}
                // eslint-disable-next-line prettier/prettier
              onChange={(e) => setDataNasc(moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY'))}
              />
              <button type="submit" onClick={handleClose}>
                {isUpdating ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={clearModal}>
            Limpar
          </button>
          <button type="button" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

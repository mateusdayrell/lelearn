import React, { useState, useEffect } from 'react';
import { FaHome, FaSignInAlt, FaVideo, FaPowerOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import './styles.css';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Navbar() {
  const dispatch = useDispatch();
  const nomeLogado = useSelector((state) => state.auth.usuario.nome);

  const [nome, setNome] = useState('Não logado');

  useEffect(() => {
    getNome();
  }, []);

  const getNome = async () => {
    setNome(nomeLogado);
  };
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    history.push('/login');
  };

  return (
    <div className="navbar">
      <Link to="/">
        <FaHome size={26} />
      </Link>
      <Link to="/videos">
        <FaVideo size={24} />
      </Link>
      <Link to="/curso">Curso</Link>
      <Link to="/treinamentos">Treinamentos</Link>
      <Link to="/login">
        <FaSignInAlt size={26} />
      </Link>
      <Link onClick={handleLogout} to="/login">
        <FaPowerOff size={24} />
      </Link>
      <span>{nome}</span>
    </div>
  );
}

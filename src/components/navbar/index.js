import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaVideo,
  FaUser,
  FaPowerOff,
  FaClone,
  FaGripHorizontal,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './styles.css';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';
import logoLigth from '../../assets/lelearn-logo-ligth.png';

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
      <div className="logo-content">
        <Link className="link" to="/">
          <img src={logoLigth} alt="" />
        </Link>
      </div>
      <ul className="nav-list">
        <li>
          <Link className="link" to="/">
            <FaHome className="icon" size={26} />
            <span className="link-name">Home</span>
          </Link>
        </li>
        <li>
          <Link className="link" to="/videos">
            <FaVideo className="icon" size={24} />
            <span className="link-name">Vídeo</span>
          </Link>
        </li>
        <li>
          <Link className="link" to="/cursos">
            <FaClone className="icon" size={24} />
            <span className="link-name">Curso</span>
          </Link>
        </li>
        <li>
          <Link className="link" to="/treinamentos">
            <FaGripHorizontal className="icon" size={24} />
            <span className="link-name">Treinamentos</span>
          </Link>
        </li>
        <li>
          <Link className="link" to="/usuarios">
            <FaUser className="icon" size={24} />
            <span className="link-name">Usuários</span>
          </Link>
        </li>
        <li>
          <Link className="link" to="/gestao-videos">
            <FaVideo className="icon" size={24} />
            <span className="link-name">Gestao vídeos</span>
          </Link>
        </li>
      </ul>

      <div className="profile">
        <div>
          <div className="circle">{nome}</div>
        </div>
        <Link onClick={handleLogout} className="link" to="/login">
          <FaPowerOff className="icon" size={24} />
        </Link>
      </div>
    </div>
  );
}

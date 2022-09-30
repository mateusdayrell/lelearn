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
      <div className='logo-content'>
        <Link className="link" to="/">
          <svg width="30" height="27" viewBox="0 0 39 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.36963 31.2345H19.5V36H0V0H6.36963V31.2345Z" fill="#00B37E" />
            <path d="M25.8696 31.2345H39V36H19.5V0H25.8696V31.2345Z" fill="#00B37E" />
          </svg>
        </Link>
      </div>
      <div className='list-content'>
        <ul>
          <li>
            <Link className="link" to="/videos">
              <FaVideo className="icon" size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/cursos">
              <FaClone className="icon" size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/treinamentos">
              <FaGripHorizontal className="icon" size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/usuarios">
              <FaUser className="icon" size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/gestao-videos">
              <FaVideo className="icon" size={24} />
            </Link>
          </li>
        </ul>
      </div>
      <div className='profile-content'>
        <Link onClick={handleLogout} className="link" to="/login">
          <FaPowerOff className="icon" size={24} />
        </Link>
      </div>
    </div >
  );
}

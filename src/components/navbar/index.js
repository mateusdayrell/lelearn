import React, { useState, useEffect } from 'react';
import {
  BookBookmark,
  Users,
  SignOut,
  BookOpen,
  YoutubeLogo,
  MonitorPlay,
} from 'phosphor-react';

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
      {/* LOGO */}
      <div className="logo-content">
        <Link className="link" to="/">
          <svg
            width="27"
            height="27"
            viewBox="0 0 39 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.36963 31.2345H19.5V36H0V0H6.36963V31.2345Z"
            />
            <path
              d="M25.8696 31.2345H39V36H19.5V0H25.8696V31.2345Z"
            />
          </svg>
        </Link>
      </div>
      {/* ICONES */}
      <div className="list-content">
        <ul>
          <li>
            <Link className="link" to="/videos">
              <YoutubeLogo size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/cursos">
              <BookBookmark size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/treinamentos">
              <BookOpen size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/usuarios">
              <Users size={24} />
            </Link>
          </li>
          <li>
            <Link className="link" to="/gestao-videos">
              <MonitorPlay size={24} />
            </Link>
          </li>
        </ul>
      </div>
      {/* USUARIO */}
      <div className="profile-content">
        {/* <div>
          <div className="circle">{nome}</div>
        </div> */}
        <Link onClick={handleLogout} className="link" to="/login">
          <SignOut size={24} />
          Sair
        </Link>
      </div>
    </div>
  );
}

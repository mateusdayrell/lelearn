import React, { useState, useEffect } from 'react';
import {
  BookBookmark,
  Users,
  SignOut,
  Bookmark,
  YoutubeLogo,
  MonitorPlay,
  Books,
  BookmarksSimple,
  CaretDoubleRight,
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

  const [open, setOpen] = useState(true);

  const menus = [
    { name: "Videos", link: "/videos", icon: YoutubeLogo },
    { name: "Cursos", link: "/cursos", icon: BookBookmark },
    { name: "Treinamentos", link: "/treinamentos", icon: Bookmark },
    { name: "Gestão de Usuários", link: "/usuarios", icon: Users, margin: true },
    { name: "Gestão de Vídeos", link: "/gestao-videos", icon: MonitorPlay },
    { name: "Gestão de Cursos", link: "/gestao-cursos", icon: Books},
    { name: "Gestão de Treinamentos", link: "/gestao-treinamentos", icon: BookmarksSimple },
  ];

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
    <div className={` ${
      open ? "navbar-closed" : "navbar-open"
    } navbar`}>
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
        <CaretDoubleRight size={20} className={`absolute cursor-pointer -right-3 top-4 rounded-full text-cinza-100 bg-cinza-400 hover:text-verde-100 duration-500 ${!open && "rotate-180 text-verde-100 hover:text-cinza-100"}`}
          onClick={() => setOpen(!open)}/>
      </div>
      {/* ICONES */}
      <div className={`${
      open ? "list-content-closed" : "list-content-open"
    } list-content`}>
        {menus?.map((menu, i) => (
            <Link to={menu?.link} key={i}>
              <div className="icons">{React.createElement(menu?.icon, { size: "24" })}</div>
              <span style={{transitionDelay: `${i + 4}0ms`,}}
                className={`whitespace-pre duration-500 ${open && "hidden"}`}
              >
                {menu?.name}
              </span>
            </Link>
          ))}
      </div>
      {/* USUARIO */}
      <div className={` ${
      open ? "profile-content-closed" : "profile-content-open"
    } profile-content`}>
        <Link onClick={handleLogout} className="link" to="/login">
          <SignOut size={24} />
          Sair
        </Link>
        <span className={`${open && "hidden"} `}>{nome}</span>
      </div>
    </div>
  );
}

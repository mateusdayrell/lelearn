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
  House
} from 'phosphor-react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './styles.css';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Navbar() {
  const dispatch = useDispatch();

  const { nome, tipo } = useSelector((state) => state.auth.usuario); // TIPO -> 0 === ADMINISTRADOR, TIPO -> 1 === USUARIO COMUM

  const selected = "w-8 h-8 bg-cinza-100 hover:bg-verde-200 flex items-center justify-center rounded-md text-cinza-500"
  const [nomeUsuario, setNomeUsuario] = useState('Não logado');
  const [open, setOpen] = useState(true);
  const [word1, setWord1] = useState('')
  const [word2, setWord2] = useState('')

  const menus = [
    { name: "Página Inicial", link: "/home", icon: House, users: [0, 1] },
    { name: "Videos", link: "/videos", icon: YoutubeLogo, users: [0, 1] },
    { name: "Cursos", link: "/cursos", icon: BookBookmark, users: [0, 1] },
    { name: "Treinamentos", link: "/treinamentos", icon: Bookmark, users: [0, 1] },
    { name: "Gestão de Usuários", link: "/usuarios", icon: Users, users: [0], margin: true },
    { name: "Gestão de Vídeos", link: "/gestao-videos", icon: MonitorPlay, users: [0] },
    { name: "Gestão de Cursos", link: "/gestao-cursos", icon: Books, users: [0] },
    { name: "Gestão de Treinamentos", link: "/gestao-treinamentos", icon: BookmarksSimple, users: [0] },
  ];

  useEffect(() => {
    getNome();
  }, []);

  const getNome = () => {
    setNomeUsuario(nome);
    handleWords(nome)
  }

  const handleWords = (name) => {
    const nomes = name.toUpperCase().split(' ')

    if (nomes.length === 1) {
      setWord1(nomes[0].slice(0, 1))
      setWord2(nomes[0].slice(1, 2))
    } else {
      setWord1(nomes[0].slice(0, 1))
      setWord2(nomes.pop().slice(0, 1))
    }
  }

  const handleCurrentMenu = (link) => {
    if (window.location.href.includes(link)) return true
    return false
  }

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    history.push('/login');
  };

  return (
    <div className={` ${open ? "navbar-closed" : "navbar-open"} navbar`}>

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
            <path d="M6.36963 31.2345H19.5V36H0V0H6.36963V31.2345Z" />
            <path d="M25.8696 31.2345H39V36H19.5V0H25.8696V31.2345Z" />
          </svg>
        </Link>
        <CaretDoubleRight
          size={20}
          className={`absolute cursor-pointer -right-3 top-4 rounded-full text-cinza-100 bg-cinza-400 hover:text-verde-100 duration-500 ${!open && "rotate-180 text-verde-100 hover:text-cinza-100"}`}
          onClick={() => setOpen(!open)} />
      </div>

      {/* ICONES */}
      <div
        className={`${open ? "list-content-closed" : "list-content-open"} list-content`}
      >
        {menus?.map((menu, i) => (
          menu.users.includes(tipo) ? // Verificar tipo do usuário
            <Link to={menu?.link} key={menu.link} className="group">
              <div
                className={handleCurrentMenu(menu.link) ? `${selected}` : "icons"}> {React.createElement(menu?.icon, { size: "24" })} </div>
              <span
                style={{ transitionDelay: `${i + 4}0ms`, }}
                className={`whitespace-pre duration-500 ${open && "hidden"} `}
              >
                {menu?.name}
              </span>
              <span className={`${!open && 'hidden'} absolute left-48 bg-verde-100 font-semibold whitespace-pre text-cinza-500 w-0 overflow-hidden
                rounded-md drop-shadow-lg px-0 py-0 group-hover:px-2 group-hover:h-8 group-hover:left-14 group-hover:duration-300 group-hover:w-fit
                flex items-center`}>
                {menu?.name}
              </span>
            </Link>
            : ''
        ))}
      </div>

      {/* USUARIO */}
      <div className={` ${open ? "profile-content-closed" : "profile-content-open"} profile-content`}>
        <span className='avatar-name'>
          {word1}{word2}
        </span>
        <span className={`${open && "hidden"} name`}>
          {nomeUsuario}
        </span>
        <Link onClick={handleLogout} className={`${open && "hidden"} link`} to="/login">
          <SignOut size={24} />
          Sair
        </Link>
      </div>
    </div>
  );
}

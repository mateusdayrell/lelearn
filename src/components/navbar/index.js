import React from 'react';
import { FaHome, FaUser, FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './styles.css';

export default function Navbar() {
  const LOGADO = useSelector((state) => state.logado.LOGADO);
  return (
    <div className="navbar">
      <Link to="/">
        <FaHome size={26} />
      </Link>
      <Link to="/usuarios">
        <FaUser size={24} />
      </Link>
      <Link to="/login">
        <FaSignInAlt size={26} />
      </Link>
      <span>{LOGADO ? 'Logado' : 'Não Logado'}</span>
    </div>
  );
}

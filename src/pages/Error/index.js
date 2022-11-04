import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function Error() {
  return (
    <div className="container">
        <h1 className="text-red-500">Página de erro!!!</h1>
        <Link  to="/" className='justify-center'>
          <button type='button' className='btn'>Voltar para página inicial</button>
        </Link>
      </div>
  );
}

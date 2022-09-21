import React from 'react';
import './style.css';
import Navbar from '../../components/Navbar';

export default function Error() {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="text-red-500">Página de erro!!!</h1>
      </div>
    </>
  );
}

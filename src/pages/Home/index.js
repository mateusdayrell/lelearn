import React from 'react';

import './style.css';
import Navbar from '../../components/Navbar';

export default function Home() {
  return (
    <>
      <div className='container-navbar'>
        <Navbar />
      </div>
      <div className='container-body'>
        <h1 className='title'>Home</h1>
      </div>
    </>
  );
}

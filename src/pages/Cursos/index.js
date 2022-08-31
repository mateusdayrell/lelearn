import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './style.css';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getCursos();
  }, []);

  const getCursos = async () => {
    setIsLoading(true);
    const { data } = await axios.get('/cursos');
    setCursos(data);
    setIsLoading(false);
  };

  const handleRedirect = (cod_curso) => {
    history.push(`/cursos/${cod_curso}`);
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <h1>Cursos</h1>
      <div className="container">
        {cursos.map((curso) => (
          <div key={curso.cod_curso}>
            <div
              className="curso"
              onClick={() => handleRedirect(curso.cod_curso)}
            >
              {curso.nome_curso}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

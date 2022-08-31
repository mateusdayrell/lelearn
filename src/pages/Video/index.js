import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './style.css';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function Cursos() {
  const params = useParams();

  const [video, setVideo] = useState({});
  const [outrosVideos, setOutrosVideos] = useState([]);
  const [curso, setCurso] = useState({});
  const [comentarios, setComentarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    const { cod_video } = params;
    setIsLoading(true);

    try {
      const { data } = await axios.get(`/videos/${cod_video}`);

      setVideo(data);
      setCurso(data.curso);
      setComentarios(data.comentarios);
      setOutrosVideos(data.curso.videos);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <h1>Vídeos</h1>
      <div className="container-video">
        <div>{video.titulo_video}</div>
        <h3>Curso</h3>
        <div>
          <p>{curso.nome_curso}</p>
          <p>Descrição {curso.desc_curso}</p>
        </div>
        <h5>Vídeos do curso</h5>
        {outrosVideos.map((element) => (
          <div key={element.cod_video}>
            <div>
              {element.cod_video} - {element.titulo_video}
            </div>
          </div>
        ))}
        <h3>Comentários</h3>
        {comentarios.map((comentario) => (
          <div key={comentario.cod_comentario}>
            <div>
              {comentario.cod_comentario} - {comentario.texto}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

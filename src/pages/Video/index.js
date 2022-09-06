import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Player, Youtube } from '@vime/react'

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
      console.log(video.link)
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
      <div className='flex'>
        <div className='video-container'>
          <h1>Vídeos</h1>
          <div className='bg-black flex justify-center'>
            <div className='h-full w-full max-w-[1100px] max-h-[60vh] aspect-video'>
              <Player>
                <Youtube videoId={video.link}/>
              </Player>
            </div>
          </div>
          <div className='p-8 max-w-[1100px] mx-auto'>
            <h1 className='text-2xl font-bold'>{video.titulo_video}</h1>
            <p className='mb-6 mt-2 text-zinc-400'>{video.desc_video}</p>

            <h3>Curso: {curso.nome_curso}</h3>
            <p>Descrição: {curso.desc_curso}</p>
          </div>

          <h3>Comentários</h3>
          {comentarios.map((comentario) => (
            <div key={comentario.cod_comentario}>
              <div>
                {comentario.cod_comentario} - {comentario.texto}
              </div>
            </div>
          ))}
        </div>

        <div className='video-list'>

          <span className='font-bold text-2xl pb-4 mb-6 border-b border-zinc-700 block'>Conteúdo do curso</span>

          <div className='flex flex-col gap-6'>
            {outrosVideos.map((el, i) => (
              <div key={el.cod_video} className="bg-zinc-800 rounded p-4 border border-zinc-300 cursor-pointer">
                <div className='flex justify-between'>
                <span>{i+1} - {el.titulo_video}</span>
                  <input type="checkbox" name="" id="" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </>
  );
}

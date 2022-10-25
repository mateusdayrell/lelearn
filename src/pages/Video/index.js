import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { Player, Youtube, DefaultUi } from '@vime/react';
// import getYoutubeId from 'get-youtube-id'

import './style.css';
// import '@vime/core/themes/default.css';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import Checkbox from '../../components/Checkbox';
import axios from '../../services/axios';
import { orderVideos } from '../../helpers/orderVideos';

export default function Cursos() {
  const params = useParams();
  const history = useHistory();

  const cpf = useSelector((state) => state.auth.usuario.cpf);

  const [video, setVideo] = useState({});
  const [videosCurso, setVideosCurso] = useState([]);
  const [videosUsuario, setVideosUsuario] = useState([])
  const [curso, setCurso] = useState({});
  const [comentarios, setComentarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadRegisters(params.cod_video);
  }, []);

  useEffect(() => {
    setReady(true);
  }, [video]);

  const loadRegisters = async (codVideo) => {
    const { cod_curso } = params
    const cod_video = codVideo || params.cod_video
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/curso-video/${cod_curso}/${cod_video}`);
      // const cursoResponse = await axios.get(`/cursos/${cod_curso}`)
      const usuarioVideosResponde = await axios.get(`usuarios-videos/${cpf}`)

      setVideo(data.video);
      setCurso(data.curso);
      setComentarios(data.video.comentarios);
      setVideosCurso(orderVideos(data.curso.videos));
      setVideosUsuario(usuarioVideosResponde.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleCheckbox = async (codVideo) => {
    try {
      setIsLoading(true)
      const { data } = await axios.put(`/usuarios-videos/${cpf}/${codVideo}`)
      setIsLoading(false);

      setVideosUsuario(data)
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error('Erro ao marcar aula como assistida/não assistida')
    }
  }

  const handleWatched = codVideo => videosUsuario.flatMap(el => el.cod_video === codVideo).includes(true)

  const handleRedirect = (codVideo) => {
    const { cod_curso } = params
    history.push(`/videos/${cod_curso}/${codVideo}`);
    loadRegisters(codVideo)
  };

  return (
    <>
      <Navbar />
      <Loading isLoading={isLoading} />
      <div className="ml-16 flex">
        <div className="video-container">
          <h1>Vídeos</h1>
          <div className="bg-black flex justify-center">
            <div className="h-full w-full max-w-[1100px] max-h-[60vh] aspect-video">
              <div>
                {/* {ready ? (
                  // <iframe width="853" height="480" src={video.link} title="Como inserir vídeo do YouTube no seu site HTML (Embed)" frameBorder="0" allow="accelerometer" allowFullScreen />

                  // <Player>
                  //   <Youtube videoId={video.link} />
                  //   <DefaultUi />
                  // </Player>
                ) : (
                  ''
                )} */}
              </div>
            </div>
          </div>
          <div className="p-8 max-w-[1100px] mx-auto">
            <div className='w-56' />

            <div className='flex justify-between'>
              <h1 className="text-2xl font-bold">{video.titulo_video}</h1>
                <span className='flex items-center gap-2'>
                  <label htmlFor="video-checkbox" className='inline'>Aula assistida</label>
                  <Checkbox
                    cId="video-checkbox"
                    cValue={video.cod_video}
                    handleCheckbox={handleCheckbox}
                    checked={handleWatched(video.cod_video)}
                  />
              </span>
            </div>
            <p className="mb-6 mt-2 text-zinc-400">{video.desc_video}</p>

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

        <div className="video-list">
          <span className="font-bold text-center text-2xl pb-4 mb-6 border-b border-zinc-700 block">
            Conteúdo do curso
          </span>

          <div className="flex flex-col gap-6">
            {videosCurso.map((el, i) => (
              <div
                key={el.cod_video}
                className={`${el.cod_video === video.cod_video ? "bg-verde-200" : "bg-zinc-800"} rounded p-4 border border-zinc-300 cursor-pointer`}
              >
                  <div className="flex justify-between">

                    <button type='button' onClick={() => handleRedirect(el.cod_video)}>
                      {i + 1} - {el.titulo_video}
                    </button>
                    <Checkbox
                      cId={`c-${el.cod_video}`}
                      cValue={el.cod_video}
                      handleCheckbox={handleCheckbox}
                      checked={handleWatched(el.cod_video)}
                    />
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Player, Youtube, DefaultUi } from '@vime/react';
import getYoutubeId from 'get-youtube-id'


import './style.css';
import './vime.css';
import Loading from '../../components/Loading';
import Checkbox from '../../components/Checkbox';
import axios from '../../services/axios';
import { orderVideos } from '../../helpers/orderVideos';
import Comments from '../../components/Comments';
import { loginFailure } from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Cursos() {
  const params = useParams();
  const uHistory = useHistory();
  const dispatch = useDispatch();

  const cpf = useSelector((state) => state.auth.usuario.cpf);

  const [video, setVideo] = useState({});
  const [videosCurso, setVideosCurso] = useState([]);
  const [videosUsuario, setVideosUsuario] = useState([])
  const [curso, setCurso] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    loadRegisters(params.cod_video);
  }, []);

  useEffect(() => {
    if(videoId &&videoId.length > 0) setReady(true);
  }, [videoId]);

  const loadRegisters = async (codVideo) => {
    const { cod_curso } = params
    const cod_video = codVideo || params.cod_video
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/videos/get-by-curso/${cod_curso}/${cod_video}`);
      const usuarioVideosResponde = await axios.get(`usuarios-videos/${cpf}/${data.curso.cod_curso}`)

      const a = (getYoutubeId(data?.video.link));
      console.log(a);
      setVideoId(a)
      setVideo(data?.video);
      setCurso(data?.curso);
      setVideosCurso(orderVideos(data?.curso.videos));
      setVideosUsuario(usuarioVideosResponde.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));

      if(error.response.status === 401) {
        dispatch(loginFailure());
        history.push('/login');
      }
    }
  };

  const handleCheckbox = async (codVideo) => {
    try {
      setIsLoading(true)
      const { data } = await axios.put(`/usuarios-videos/${cpf}/${curso.cod_curso}/${codVideo}`)
      setIsLoading(false);

      setVideosUsuario(data)
    } catch (error) {
      setIsLoading(false);
      toast.error('Erro ao marcar aula como assistida/não assistida')
    }
  }

  const handleWatched = codVideo => videosUsuario.flatMap(el => el.cod_video === codVideo).includes(true)

  const handleRedirect = (codVideo) => {
    setReady(false)
    const { cod_curso } = params
    uHistory.push(`/videos/${cod_curso}/${codVideo}`);
    loadRegisters(codVideo)
  };

  const handleRedirectCurso = (cod_curso) => {
    uHistory.push(`/cursos/${cod_curso}`);
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="ContainerBodyVideo">
        <h1 className='title flex'>
          <button
          type='button'
          onClick={() => handleRedirectCurso(curso.cod_curso)}
          className="cursor-pointer hover:underline-offset-auto hover:underline">{curso.nome_curso}</button> / <p>{video.titulo_video}</p></h1>
        <div className='flex'>
          <div className="ContainerCentralPageVideo">
            <div className='ContainerVideo'>
              {videoId &&videoId.length > 0 ? (
                // <iframe width="853" height="480" src={video.link} title="Como inserir vídeo do YouTube no seu site HTML (Embed)" frameBorder="0" allow="accelerometer" allowFullScreen />

                <Player>
                  <Youtube videoId={videoId} />
                  <DefaultUi />
                </Player>
              ) : (
                <p>Video nao encontrado</p>
              )}
            </div>

            <div className='py-2 px-1'>
              <div className='flex justify-between text-cinza-100'>
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
              <p className="text-sm text-cinza-200">{video.desc_video}</p>
              {/* <h3>Curso: {curso.nome_curso}</h3>
            <p>Descrição: {curso.desc_curso}</p> */}

              <div className='w-full h-[1px] bg-cinza-300 rounded my-3' />

              <h3 className='text-cinza-100 font-semibold'>Comentários</h3>
              <Comments codVideo={params.cod_video} codCurso={params.cod_curso} cpf={cpf} />
            </div>
          </div>

          <div className="ContainerCursoConteudo">
            <span className="font-bold text-center text-2xl block text-cinza-100">
              Conteúdo do curso
            </span>

            <div className='w-full h-[1px] bg-cinza-350 my-3'/>

            <div className="flex flex-col gap-4">
              {videosCurso?.map((el) => (
                <div
                  key={el.cod_video}
                  aria-hidden
                  className={`${el.cod_video === video.cod_video ? "bg-verde-100 border-none text-cinza-500 shadow hover:bg-verde-200" : "bg-cinza-500 hover:bg-cinza-400"} w-full h-20 p-4 rounded-xl border border-cinza-200 cursor-pointer text-cinza-100`}
                  onClick={() => handleRedirect(el.cod_video)}
                >
                  <div className="flex justify-between items-center text-base w-full h-full">
                    <span>
                      {el.titulo_video}
                    </span>
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
      </div>
    </>
  );
}

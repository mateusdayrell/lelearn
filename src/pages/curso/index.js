import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FaCaretRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { MagnifyingGlass, Play } from 'phosphor-react';

import './style.css';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import { orderVideos } from '../../helpers/orderVideos';

export default function Cursos() {
  const history = useHistory();
  const params = useParams();
  const { cod_curso } = params;

  const [searchNome, setSearchNome] = useState('');/* procurar */
  const [curso, setCurso] = useState({});
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/cursos/${cod_curso}`);
      setCurso(data);
      setVideos(orderVideos(data.videos));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleRedirect = (cod_video) => {
    history.push(`/videos/${cod_curso}/${cod_video}`);
  };

  const clearSearch = () => {
    setSearchNome('');
    loadRegisters();
  };

  const handleSearch = async () => {
    const querys = new URLSearchParams({
      titulo_video: searchNome,
      cod_curso
    }).toString();

    setIsLoading(true);
    try {
      const { data } = await axios.get(`/videos/search/${querys}`);
      setIsLoading(false);
      setVideos(data);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container-body">
        <div className=''>
          <div className='flex justify-between'>
            <div className='title'>{curso.nome_curso}</div>
            <div className="SearchFormTitle">
              <div className='SearchInput'>
                <input
                  type="text"
                  name="titulo"
                  placeholder="Pesquisar"
                  value={searchNome}
                  onChange={(e) => setSearchNome(e.target.value)}
                />
                <button
                  title="Pesquisar"
                  type="button"
                  onClick={handleSearch}>
                  <MagnifyingGlass size={24} />
                </button>
              </div>
            </div>
          </div>

          {videos.map((video) => (
            <div key={video.cod_video} className="list-videos">
              <div key={video.cod_video} className="flex items-center gap-3 w-1/2">
                <div className='title-video'>
                  {video.titulo_video}
                </div>
                <div className='video-info'>
                  <p className='text-xs text-[12px] mr-8'>{video.desc_video}</p>
                </div>
              </div>
              {/* <div className='acessar-button  bg-cinza-500 shadow-md '>
                <button
                  type='button'
                  className=''
                  onClick={() => handleRedirect(video.cod_video)}
                >
                  <FaCaretRight
                    className='play-button'
                    size={37} />
                  <p className='msg-button'>Acessar</p>
                </button>
              </div> */}
              <div className='BtnCurso'>
                <button
                  type='button'
                  className='block'
                  onClick={() => handleRedirect(video.cod_video)}>
                  <Play size={20} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

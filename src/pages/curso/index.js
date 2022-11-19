import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FaCaretRight, FaFileImage } from 'react-icons/fa';

import './style.css';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import { orderVideos } from '../../helpers/orderVideos';

export default function Cursos() {
  const history = useHistory();
  const params = useParams();

  const [curso, setCurso] = useState({});
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurso();
  }, []);

  const getCurso = async () => {
    const { cod_curso } = params;
    setIsLoading(true);

    try {
      const { data } = await axios.get(`/cursos/${cod_curso}`);

      setCurso(data);
      setVideos(orderVideos(data.videos));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleRedirect = (cod_video) => {
    const { cod_curso } = params;
    history.push(`/videos/${cod_curso}/${cod_video}`);
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container-body text-gray-50">
        <div>
          <div className='title'>{curso.nome_curso}</div>
          {videos.map((video, indice) => (
            <div className="list-videos">
              <div key={video.cod_video} className="flex items-center gap-3  ">
                <div className='title-video' >
                  {indice + 1} - {video.titulo_video}
                </div>
                <div className='video-info'>
                  <p className='text-xs text-[12px]'>{video.desc_video}</p>
                </div>
              </div>
              <div className='acessar-button  bg-cinza-500 shadow-md '>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

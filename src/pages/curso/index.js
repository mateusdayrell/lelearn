import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

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
      <h1>Cursos</h1>
        <div>
          <div>{curso.nome_curso}</div>
          <h3>Videos</h3>
          {videos.map((video, indice) => (
            <div key={video.cod_video}>
              <div
                className="video"
                onClick={() => handleRedirect(video.cod_video)}
              >
                {indice + 1} - {video.titulo_video}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

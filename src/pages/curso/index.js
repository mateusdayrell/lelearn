import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import './style.css';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

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
      setVideos(data.videos);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleRedirect = (cod_video) => {
    history.push(`/videos/${cod_video}`);
  };

  return (
    <>
      <Navbar />
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

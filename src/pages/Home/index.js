import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment/moment';

import axios from '../../services/axios';
import Calendario from '../../components/Calendario';
import TimelineTreinamento from '../../components/TimelineTreinamento';
import Loading from '../../components/Loading';
import './style.css';

export default function Home() {
  const location = useLocation();

  const { nome, cpf } = useSelector((state) => state.auth.usuario);

  const [nomeUsuario, setNomeUsuario] = useState('Não logado');
  const [treinamentos, setTreinamentos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [maisAssistidos, setMaisAssistidos] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNome();
    getTreinamentos();
  }, [location]);

  const getNome = () => {
    setNomeUsuario(nome);
  }

  const getTreinamentos = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/usuarios/get-treinamentos/${cpf}`);
      const cursosResponse = await axios.get(`/usuarios/get-cursos/${cpf}`);
      const maisAssistidosResponse = await axios.get('/cursos-mais-assistidos/');

      setTreinamentos(data);
      setCursos(cursosResponse?.data)
      setMaisAssistidos(maisAssistidosResponse?.data)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='container-body'>
        <h1 className='title'>Página Inicial</h1>

        <div className='flex gap-2'>
          <div className='w-3/4 h-full'>
            <div className='w-full h-52 flex p-4 items-center bg-cinza-400 rounded-xl border-[1px] border-cinza-350 justify-around'>
              <div>
                <p className='text-cinza-100 text-base'>Olá, {nomeUsuario} 😁</p>
                <h2 className='text-3xl text-verde-100 font-bold'>Bem-vindo ao LeLearn!</h2>
              </div>
              <svg width="293" height="193" viewBox="0 0 293 193" fill="none" className='SVGHome'>
                <path d="M215.523 55.6111C231.717 63.6938 256.987 66.9392 270.332 71.5183C283.676 76.0975 291.742 85.7661 292.369 101.517C292.997 117.268 286.971 133.226 277.18 147.63C267.388 162.034 253.83 174.78 237.008 182.448C220.187 190.116 200.101 192.707 180.266 192.5C160.306 192.189 140.597 188.977 124.654 180.894C108.837 172.707 96.6595 159.754 86.6167 145.661C76.4484 131.568 68.4141 116.335 68.4141 101.206C68.4141 86.077 70.864 79.0577 77.7871 68.4445C87.4533 53.6262 100.766 38.7638 116.709 30.4738C132.652 22.1839 144.734 18.4097 165.322 18.5133C186.035 18.6169 199.329 47.4247 215.523 55.6111Z" fill="#00B37E" fill-opacity="0.65" /> {/* eslint-disable-line */}
                <path d="M10.727 68.9634H32.84L32.84 149.592H54.796V160H22.0927V79.4852H0V0H10.727V68.9634Z" fill="#00B37E" />
                <path d="M90.1765 46.4336C90.1765 48.7972 90.051 50.932 89.8001 52.8381H50.1852C50.4988 57.8703 52.0358 61.9113 54.7959 64.9611C57.5561 68.0108 60.9436 69.5356 64.9584 69.5356C70.7297 69.5356 74.8072 66.6003 77.191 60.7295H88.7651C87.1968 66.5241 84.3424 71.2893 80.2021 75.0253C76.1246 78.6851 71.0433 80.5149 64.9584 80.5149C60.0026 80.5149 55.5487 79.1806 51.5966 76.512C47.7073 73.7672 44.6334 69.9551 42.3751 65.0754C40.1795 60.1195 39.0817 54.4011 39.0817 47.9203C39.0817 41.4395 40.1481 35.7593 42.281 30.8796C44.4766 25.9237 47.5191 22.1115 51.4084 19.4429C55.3605 16.7743 59.8772 15.44 64.9584 15.44C69.8514 15.44 74.2113 16.7362 78.0379 19.3285C81.8645 21.9209 84.8443 25.5806 86.9772 30.3078C89.11 34.9587 90.1765 40.334 90.1765 46.4336ZM78.9789 42.3163C78.9162 37.5129 77.5047 33.6626 74.7445 30.7653C71.9843 27.868 68.5655 26.4193 64.4879 26.4193C60.7868 26.4193 57.6189 27.868 54.9841 30.7653C52.3494 33.5863 50.7811 37.4367 50.2793 42.3163H78.9789Z" fill="white" />
                <path d="M112.132 125.919C112.132 128.282 112.007 130.417 111.756 132.323H72.1411C72.4548 137.355 74.1799 141.396 76.9401 144.446C79.7003 147.496 82.8997 149.021 86.9145 149.021C92.6858 149.021 96.7633 146.085 99.1471 140.214H110.721C109.153 146.009 106.298 150.774 102.158 154.51C98.0806 158.17 92.9994 160 86.9145 160C81.9587 160 77.5047 158.666 73.5526 155.997C69.6632 153.252 66.5894 149.44 64.3311 144.56C62.1355 139.605 61.0377 133.886 61.0377 127.405C61.0377 120.925 62.1041 115.244 64.237 110.365C66.4326 105.409 69.4751 101.596 73.3644 98.9279C77.3165 96.2594 81.8332 94.9251 86.9145 94.9251C91.8075 94.9251 96.1673 96.2212 99.9939 98.8135C103.821 101.406 106.8 105.066 108.933 109.793C111.066 114.444 112.132 119.819 112.132 125.919ZM100.935 121.801C100.872 116.998 99.4607 113.148 96.7005 110.25C93.9404 107.353 90.5214 105.904 86.4439 105.904C82.7428 105.904 79.5748 107.353 76.9401 110.25C74.3054 113.071 72.7371 116.922 72.2352 121.801H100.935Z" fill="white" />
                <path d="M119.113 127.177C119.113 120.848 120.18 115.244 122.313 110.365C124.508 105.485 127.457 101.711 131.158 99.0423C134.922 96.2975 139.062 94.9251 143.579 94.9251C147.656 94.9251 151.2 95.9163 154.212 97.8986C157.285 99.8048 159.732 102.206 161.551 105.104V95.9544H172.372V158.971H161.551V149.593C159.732 152.566 157.254 155.044 154.117 157.026C150.981 159.009 147.405 160 143.39 160C138.936 160 134.859 158.628 131.158 155.883C127.457 153.062 124.508 149.173 122.313 144.217C120.18 139.185 119.113 133.505 119.113 127.177ZM161.551 127.405C161.551 123.059 160.798 119.285 159.293 116.083C157.85 112.881 155.937 110.441 153.553 108.764C151.169 107.086 148.597 106.247 145.837 106.247C143.077 106.247 140.505 107.086 138.121 108.764C135.737 110.365 133.792 112.766 132.287 115.969C130.844 119.095 130.123 122.831 130.123 127.177C130.123 131.523 130.844 135.335 132.287 138.613C133.792 141.892 135.737 144.408 138.121 146.162C140.567 147.839 143.139 148.678 145.837 148.678C148.597 148.678 151.169 147.839 153.553 146.162C155.937 144.484 157.85 142.044 159.293 138.842C160.798 135.564 161.551 131.751 161.551 127.405Z" fill="white" />
                <path d="M197.189 105.104C198.757 101.901 200.827 99.4235 203.399 97.6699C206.034 95.84 209.139 94.9251 212.715 94.9251V108.42H209.986C205.783 108.42 202.584 109.717 200.388 112.309C198.255 114.901 197.189 119.4 197.189 125.804V158.971H186.462V95.9544H197.189V105.104Z" fill="white" />
                <path d="M248.734 94.9251C252.812 94.9251 256.45 95.9544 259.649 98.013C262.911 100.072 265.452 103.121 267.271 107.162C269.09 111.203 270 116.083 270 121.801V158.971H259.367V123.746C259.367 118.104 258.206 113.796 255.885 110.822C253.564 107.772 250.396 106.247 246.382 106.247C242.367 106.247 239.167 107.772 236.784 110.822C234.463 113.796 233.302 118.104 233.302 123.746V158.971H222.575V95.9544H233.302V103.16C235.059 100.567 237.286 98.5468 239.983 97.0981C242.743 95.6495 245.66 94.9251 248.734 94.9251Z" fill="white" />
              </svg>
            </div>

            <h2 className='text-laranja-100 text-lg my-2'>Cursos em andamento</h2>
            <div className='gap-3 flex flex-wrap'>
              {!cursos || cursos.length === 0
                ? <p className='text-cinza-300 text-sm'>Você não iniciou nenhum curso.</p> // estiliza isso aqui tbm, pode mudar o texto
                : cursos?.map((curso) => (
                  curso.videos_assistidos > 0 && curso.videos_assistidos < curso.total_videos &&
                  <div key={curso.cod_curso} className='w-52 h-16 bg-cinza-400 rounded border-[1px] border-cinza-350 flex items-center p-2 justify-between'>
                    <p className='text-sm text-cinza-100'>{curso.nome_curso}</p>
                    <span className='w-14 h-14 border-4 border-cinza-350 rounded-full flex items-center justify-center text-sm text-cinza-200'>
                      {curso.total_videos > 0 && `${Math.floor(curso.videos_assistidos / curso.total_videos * 100)}%`}
                    </span>
                  </div>
                ))
              }
            </div>

          </div>

          <div className='w-[1px] rounded h-screen bg-cinza-350 mx-2' />

          <div className='ContainerLateralHome'>
            <div>
              <h2 className='text-laranja-100 font-semibold'>Cronograma</h2>
              <span className='text-xs text-azul-200 font-semibold flex'><span className='capitalize'>{moment().format('dddd')}</span>, {moment().format('LL')}</span>
            </div>
            <div className='mt-2'>
              <Calendario />
            </div>
            <div className='w-full h-full rounded-xl bg-cinza-400 p-2 mt-2 border-cinza-350 border-[1px] gap-2 flex flex-col'>
              {treinamentos.map((treinamento) => (
                <TimelineTreinamento
                  key={treinamento.cod_treinamento}
                  treinamento={treinamento} />
              ))}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

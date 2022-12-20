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
import CursoDestaque from '../../components/CursoDestaque';

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
      console.log(maisAssistidosResponse)
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
        <h2 className='text-cinza-200 text-sm'>Olá, {nomeUsuario}😉! Bem-vindo ao <b className='text-verde-100'>LeLearn</b>!</h2>

        <div className='flex gap-2'>
          <div className='w-3/4 h-full rounded-xl'>
            <h2 className='text-laranja-100 font-semibold'>Cursos mais populares</h2>
            <div className='w-full h-80 flex gap-2 flex-wrap'>
              {maisAssistidos?.map((data) => (
                <CursoDestaque
                  key={data.cod_curso}
                  data={data} />
              ))}
            </div>

            <h2 className='text-laranja-100 my-2 font-semibold'>Cursos em andamento</h2>
            <div className='gap-3 flex flex-wrap'>
              {!cursos || cursos.length === 0
                ? <p className='text-cinza-300 text-xs'>Você não iniciou nenhum curso.</p>
                : cursos?.map((curso) => (
                  curso.videos_assistidos > 0 && curso.videos_assistidos < curso.total_videos &&
                  <div key={curso.cod_curso} className='w-56 h-20 bg-cinza-400 rounded-3xl flex items-center'>
                    <svg width="91" height="82" viewBox="0 0 91 82" fill="none">
                      <path className='drop-shadow-md' d="M0 20C0 8.9543 8.95431 0 20 0H69.4222H70.7434C90.0888 0 98.1635 24.7313 82.5451 36.1468L27.0269 76.7253C24.1156 78.8532 20.6031 80 16.9971 80V80C7.60987 80 0 72.3901 0 63.0029V20Z" fill="url(#paint0_linear_700_1738)" />
                      <defs>
                        <linearGradient id="paint0_linear_700_1738" x1="11.5" y1="63" x2="82.1628" y2="4.00801" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#77DFE1" />
                          <stop offset="1" stopColor="#00B37E" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <p className='absolute translate-x-6 -translate-y-3 font-semibold text-xl'>{curso.total_videos > 0 && `${Math.floor(curso.videos_assistidos / curso.total_videos * 100)}%`}</p>
                    <p className='text-sm text-cinza-100'>{curso.nome_curso}</p>
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
              <h2 className='text-sm text-laranja-100 font-semibold'>Treinamentos</h2>
              {!treinamentos || treinamentos.length === 0
                ? <p className='text-cinza-300 text-xs'>Você não possui treinamentos com prazo definidos.</p>
                : treinamentos.map((treinamento) => (
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

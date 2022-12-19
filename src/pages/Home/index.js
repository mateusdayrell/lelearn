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
      setTreinamentos(data);
      setCursos(cursosResponse?.data)
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
          <div className='w-3/4 h-full text-cinza-200'>
            <div className='w-full h-52 bg-cinza-400 rounded-md shadow-md flex'>
              <div>
                <svg width="270" height="160" viewBox="0 0 431 210">
                  <path className='PathSVGHome' d="M17.5336 90.452H52.7838L52.7839 196.202H87.7839V209.852H35.6515V104.252H0.433594V0.00195312H17.5336V90.452Z" fill="#00B37E" />
                  <path className='PathSVGHome' d="M144.184 60.9026C144.184 64.0026 143.984 66.8026 143.584 69.3026H80.4338C80.9338 75.9026 83.3837 81.2026 87.7837 85.2026C92.1837 89.2026 97.5837 91.2025 103.984 91.2025C113.184 91.2025 119.684 87.3526 123.484 79.6526H141.934C139.434 87.2526 134.884 93.5025 128.284 98.4025C121.784 103.203 113.684 105.602 103.984 105.602C96.0837 105.602 88.9838 103.852 82.6838 100.352C76.4838 96.7524 71.5837 91.7526 67.9837 85.3526C64.4837 78.8526 62.7337 71.3526 62.7337 62.8526C62.7337 54.3526 64.4337 46.9026 67.8337 40.5026C71.3337 34.0026 76.1837 29.0026 82.3837 25.5026C88.6837 22.0026 95.8837 20.2526 103.984 20.2526C111.784 20.2526 118.734 21.9526 124.834 25.3526C130.934 28.7526 135.684 33.5526 139.084 39.7526C142.484 45.8526 144.184 52.9026 144.184 60.9026ZM126.334 55.5026C126.234 49.2026 123.984 44.1526 119.584 40.3526C115.184 36.5526 109.734 34.6526 103.234 34.6526C97.3337 34.6526 92.2838 36.5526 88.0838 40.3526C83.8838 44.0526 81.3838 49.1026 80.5838 55.5026H126.334Z" fill="white" />
                  <path className='PathSVGHome' d="M179.184 165.152C179.184 168.252 178.984 171.052 178.584 173.552H115.434C115.934 180.152 118.684 185.452 123.084 189.452C127.484 193.452 132.584 195.452 138.984 195.452C148.184 195.452 154.684 191.602 158.484 183.902H176.934C174.434 191.502 169.884 197.752 163.284 202.652C156.784 207.452 148.684 209.852 138.984 209.852C131.084 209.852 123.984 208.102 117.684 204.602C111.484 201.002 106.584 196.002 102.984 189.602C99.4837 183.102 97.7337 175.602 97.7337 167.102C97.7337 158.602 99.4337 151.152 102.834 144.752C106.334 138.252 111.184 133.252 117.384 129.752C123.684 126.252 130.884 124.502 138.984 124.502C146.784 124.502 153.734 126.202 159.834 129.602C165.934 133.002 170.684 137.802 174.084 144.002C177.484 150.102 179.184 157.152 179.184 165.152ZM161.334 159.752C161.234 153.452 158.984 148.402 154.584 144.602C150.184 140.802 144.734 138.902 138.234 138.902C132.334 138.902 127.284 140.802 123.084 144.602C118.884 148.302 116.384 153.352 115.584 159.752H161.334Z" fill="white" />
                  <path className='PathSVGHome' d="M190.312 166.802C190.312 158.502 192.012 151.152 195.412 144.752C198.912 138.352 203.612 133.402 209.512 129.902C215.512 126.302 222.112 124.502 229.312 124.502C235.812 124.502 241.462 125.802 246.262 128.402C251.162 130.902 255.062 134.052 257.962 137.852V125.852H275.212V208.502H257.962V196.202C255.062 200.102 251.112 203.352 246.112 205.952C241.112 208.552 235.412 209.852 229.012 209.852C221.912 209.852 215.412 208.052 209.512 204.452C203.612 200.752 198.912 195.652 195.412 189.152C192.012 182.552 190.312 175.102 190.312 166.802ZM257.962 167.102C257.962 161.402 256.762 156.452 254.362 152.252C252.062 148.052 249.012 144.852 245.212 142.652C241.412 140.452 237.312 139.352 232.912 139.352C228.512 139.352 224.412 140.452 220.612 142.652C216.812 144.752 213.712 147.902 211.312 152.102C209.012 156.202 207.862 161.102 207.862 166.802C207.862 172.502 209.012 177.502 211.312 181.802C213.712 186.102 216.812 189.402 220.612 191.702C224.512 193.902 228.612 195.002 232.912 195.002C237.312 195.002 241.412 193.902 245.212 191.702C249.012 189.502 252.062 186.302 254.362 182.102C256.762 177.802 257.962 172.802 257.962 167.102Z" fill="white" />
                  <path className='PathSVGHome' d="M314.772 137.852C317.272 133.652 320.572 130.402 324.672 128.102C328.872 125.702 333.822 124.502 339.522 124.502V142.202H335.172C328.472 142.202 323.372 143.902 319.872 147.302C316.472 150.702 314.772 156.602 314.772 165.002V208.502H297.672V125.852H314.772V137.852Z" fill="white" />
                  <path className='PathSVGHome' d="M396.94 124.502C403.44 124.502 409.24 125.852 414.34 128.552C419.54 131.252 423.59 135.252 426.49 140.552C429.39 145.852 430.84 152.252 430.84 159.752V208.502H413.89V162.302C413.89 154.902 412.04 149.252 408.34 145.352C404.64 141.352 399.59 139.352 393.19 139.352C386.79 139.352 381.69 141.352 377.89 145.352C374.19 149.252 372.34 154.902 372.34 162.302V208.502H355.24V125.852H372.34V135.302C375.14 131.902 378.69 129.252 382.99 127.352C387.39 125.452 392.04 124.502 396.94 124.502Z" fill="white" />
                </svg>
              </div>
              <div className='w-2/3 h-full flex items-center font-semibold'>
                <p className='text-cinza-200 text-sm'>Olá, {nomeUsuario}</p>
              </div>
            </div>

            <h2 className='text-laranja-100 font-semibold my-2'>Cursos em andamento</h2>
            {!cursos || cursos.length === 0
              ? <p>Nenhum curso iniciado</p> // estiliza isso aqui tbm, pode mudar o texto
              : cursos?.map((curso) => (
                curso.videos_assistidos > 0 && curso.videos_assistidos < curso.total_videos &&
                <div key={curso.cod_curso}>
                  <p>{curso.nome_curso} - {curso.total_videos > 0 && `${Math.floor(curso.videos_assistidos / curso.total_videos * 100)  }%`}</p>
                </div>
              ))
            }
          </div>

          <div className='w-[1px] rounded h-[full] bg-cinza-350 mx-2' />

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

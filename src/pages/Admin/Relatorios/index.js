/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';

export default function Relatorios() {
  const base = `${process.env.REACT_APP_BACKEND_URL  }/relatorios`;

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true)
  const [tipo, setTipo] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [treinamentos, setTreinamentos] = useState([]);
  const [valor, setValor] = useState("");
  const [url, setUrl] = useState('');

  useEffect(() => {
    handleTipo();
  }, [tipo])

  useEffect(() => {
    handleUrl();
  }, [valor])

  const handleTipo = async() => {
    try {
      setIsLoading(true)
      if(tipo === "usuario-treinamentos" || tipo === "usuario-cursos") {
        const { data } = await axios.get('/usuarios');
        setTreinamentos([])
        setValor('')
        setUsuarios(data);
        handleUrl()
      }
      else if(tipo === "treinamento") {
        const { data } = await axios.get('/treinamentos');
        setUsuarios([])
        setValor('')
        setTreinamentos(data);
        handleUrl()
      }
      else if(tipo === "cursos" || tipo === "videos"){
        setUsuarios([])
        setTreinamentos([])
        setValor('')
        handleUrl()
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleUrl = () => {
    if(tipo === 'cursos') setUrl(`${base}/${tipo}`)
    else setUrl(`${base}/${tipo}/${valor}`)
    handleDisabled()
  }

  const handleDisabled = () => {
    if(tipo === "cursos" || tipo === "videos"  || (tipo && valor)) setDisabled(false)
    else setDisabled(true);
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='ml-[10%] w-[30%]  items-center mb-8  border-cinza-350 leading-3 text-cinza-200 text-sm rounded-xl p-6 select-none bg-cinza-400' >
      <div className="w-full h-full g-curso-container">
        <div className='title'>Relatórios</div>
        <div className=' h-[15%] '>
          <form action={url} method="get" target="_blank">
            <div className='flex gap-5'>
              <div>
                <label className='mb-2'>Tipo de relatório</label>
                <select
                  className='w-full min-w-full'
                  name="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}>
                    <option value="" disabled>Selecione um tipo</option>
                    <option value="treinamento">Treinamento</option>
                    <option value="usuario-treinamentos">Treinamentos do usuário</option>
                    <option value="usuario-cursos">Cursos do usuário</option>
                    <option value="cursos">Cursos</option>
                    <option value="videos">Vídeos</option>
                </select>
              </div>
              {(tipo === "usuario-treinamentos" || tipo === "usuario-cursos")  &&
                <div>
                  <label className='mb-2'>Usuário</label>
                  <select
                  className='w-full min-w-full'
                    name="usuario"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}>
                      <option value="" disabled>Selecione um usuário</option>
                        {usuarios.length > 0 &&
                          usuarios.map((u) => (
                            <option key={`u-${u.cpf}`} value={u.cpf}>{u.nome} | {u.cpf}</option>
                          ))
                        }
                  </select>
                </div>
              }
              {tipo === "treinamento"  &&
                <div>
                  <label className='mb-2'>Treinamento</label>
                  <select
                  className='w-full min-w-full'
                    name="treinamento"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}>
                      <option value="" disabled>Selecione um treinamento</option>
                        {treinamentos.length > 0 &&
                          treinamentos.map((t) => (
                            <option key={`t-${t.cod_treinamento}`} value={t.cod_treinamento}>{t.nome_treinamento} | {t.cod_treinamento}</option>
                          ))
                        }
                  </select>
                </div>
              }
            </div>
            <div className='mt-3'>
              <input type="submit" value="Gerar relatório" disabled={disabled}/>
              <p className='InformationP'><i>O relatório será gerado em formato PDF.</i></p>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}

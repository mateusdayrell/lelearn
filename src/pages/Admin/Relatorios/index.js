/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';

import axios from '../../../services/axios';
import Loading from '../../../components/Loading';

export default function Relatorios() {
  const base = `${process.env.REACT_APP_BACKEND_URL  }/relatorios`;

  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true)
  const [tipo, setTipo] = useState("");
  const [tipoArr, setTipoArr] = useState([]);
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
        setTipoArr(data);
      }
      else if(tipo === "treinamento") {
        const { data } = await axios.get('/treinamento');
        setTipoArr(data);
      }
      else if(tipo === "videos"){
        handleUrl()
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleUrl = () => {
    if(tipo === 'videos') setUrl(`${base}/${tipo}`)
    else setUrl(`${base}/${tipo}/${valor}`)
    handleDisabled()
  }

  const handleDisabled = () => {
    if(tipo === "videos" || (tipo && valor)) setDisabled(false)
    else setDisabled(true);
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container-body g-curso-container">
        <div className='title'>Relatórios</div>
        <div>
          <form action={url} method="get" target="_blank">
            <div className='flex gap-5'>
              <div>
                <label>Tipo de relatório</label>
                <select
                  name="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}>
                    <option value="" disabled>Selecione um tipo</option>
                    <option value="treinamento">Treinamento</option>
                    <option value="usuario-treinamentos">Treinamentos do usuário</option>
                    <option value="usuario-cursos">Cursos do usuário</option>
                    <option value="videos">Vídeos</option>
                </select>
              </div>
              {(tipo === "usuario-treinamentos" || tipo === "usuario-cursos")  &&
                <div>
                  <label>Usuário</label>
                  <select
                    name="usuario"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}>
                      <option value="" disabled>Selecione um usuário</option>
                        {tipoArr.length > 0 &&
                          tipoArr.map((u) => (
                            <option key={u.cpf} value={u.cpf}>{u.nome}</option>
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
    </>
  );
}

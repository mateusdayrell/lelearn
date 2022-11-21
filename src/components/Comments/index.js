import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import axios from '../../services/axios';
import Loading from '../Loading';

export default function Comments({codVideo, cpf}) {
  const [comentarios, setComentarios] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [texto, setTexto] = useState('');

  const [comentarioAtivo, setComentarioAtivo] = useState('');
  const [respostaAtiva, setRespostaAtiva] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    loadRootComments();
  }, []);

  const loadRootComments = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/comentarios/root/${codVideo}`);

      setComentarios(data)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleRepplyes = (cod) => {
    if(respostaAtiva === cod) {
      setRespostaAtiva('')
      setRespostas([])
    } else {
      setRespostaAtiva(cod)
      loadRepplyes(cod)
    }
  }

  const loadRepplyes = async (cod) => {
    setIsLoading(true);
    try {
      console.log(cod);
      const { data } = await axios.get(`/comentarios/repplyes/${cod}`);

      setRespostas(data)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const regTemp = {
      cpf,
      cod_video: codVideo,
      comentario_pai: comentarioAtivo,
      texto
    };

    try {
      setIsLoading(true)

      await axios.post('/comentarios', regTemp)

      setRespostaAtiva(comentarioAtivo)
      loadRepplyes(comentarioAtivo)
      closeInput()

      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  const closeInput = () => {
    setTexto('')
    setComentarioAtivo('')
  }

  return (
    <div>
      <Loading isLoading={isLoading} />
      {comentarios?.map((comentario) => (
        <div key={comentario.cod_comentario}>
          <div className='border-2 my-1 p-2'>
            <p>{comentario.usuario.nome}</p>
            <p>{comentario.texto}</p>
            <div>
              <button
                type='button'
                className='text-verde-100'
                onClick={() => handleRepplyes(comentario.cod_comentario)}>
                  {respostaAtiva === comentario.cod_comentario ? 'Ocultar' : `${comentario.respostas_qtd} Respostas`}
              </button>

              <button
                type='button'
                className='pl-3 text-cinza-200'
                onClick={() => setComentarioAtivo(comentario.cod_comentario)}>
                  Responder
              </button>

              {cpf === comentario.usuario.cpf &&
                <button type='button' className='text-azul-100 pl-3'>Editar</button>
              }
            </div>

            {comentarioAtivo === comentario.cod_comentario &&
              <div>
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)} />
                <button type='button' onClick={handleSubmit} className="pl-1">Responder</button>
                <button type='button' onClick={closeInput} className="pl-1 text-laranja-100">Cancelar</button>
              </div>
            }

            {respostaAtiva === comentario.cod_comentario &&
              respostas?.map((repply) => (
                <p key={repply.cod_comentario}>{repply.texto}</p>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );
}

Comments.defaultProps = {
  codVideo: '',
  cpf: '',
};

Comments.propTypes = {
  codVideo: PropTypes.string,
  cpf: PropTypes.string,
};

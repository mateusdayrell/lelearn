import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import axios from '../../services/axios';
import Loading from '../Loading';
import "./style.css";

export default function NewComment({ codVideo, codCurso, cpf, comentarioPai, loadRegisters }) {

  const [textoResposta, setTextoResposta] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const handlePostComment = async () => {
    if (!validateForm()) return;
    const regTemp = {
      cpf,
      cod_video: codVideo,
      cod_curso: codCurso,
      comentario_pai: comentarioPai || null,
      texto: textoResposta
    };

    try {
      setIsLoading(true)
      await axios.post('/comentarios', regTemp)
      setIsLoading(false)

      toast.success('Comentário postado com sucesso.')

      setTextoResposta('')
      if (comentarioPai) loadRegisters(comentarioPai)
      else loadRegisters()
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  }

  const validateForm = () => {
    let controle = true;

    if (!textoResposta) {
      toast.error('Comentário vazio.');
      controle = false;
    } else if (textoResposta.length < 3 || textoResposta.length > 900) {
      controle = false;
      toast.error('O comentário deve ter entre 3 e 900 caracteres');
    }

    return controle;
  };

  return (
    <div>
      <Loading isLoading={isLoading} />
      <div className='flex flex-col'>
        {/* <label>{title}</label> */}
        <div className='AreaComent'>
          <input type="text"
          value={textoResposta}
          placeholder='Adicione um comentário...'
          onChange={(e) => setTextoResposta(e.target.value)} />
          <div className='UnderlineComent' />
        </div>
        <div className='w-full flex justify-end my-2'>
          <button type='button'
            onClick={handlePostComment}
            className='px-2 py-1 text-sm rounded-xl text-cinza-200 bg-cinza-400 hover:text-verde-100 transition-all'>
            Comentar
          </button>
        </div>
      </div>
    </div>
  );
}

NewComment.defaultProps = {
  codVideo: '',
  codCurso: '',
  cpf: '',
  comentarioPai: '',
  loadRegisters: () => null,
};

NewComment.propTypes = {
  codVideo: PropTypes.string,
  codCurso: PropTypes.string,
  cpf: PropTypes.string,
  comentarioPai: PropTypes.string,
  loadRegisters: PropTypes.func,
};

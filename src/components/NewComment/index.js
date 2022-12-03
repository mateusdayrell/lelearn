import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import axios from '../../services/axios';
import Loading from '../Loading';

export default function NewComment({codVideo, cpf, title, comentarioPai, loadRegisters}) {

  const [textoResposta, setTextoResposta] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const handlePostComment = async () => {
    if (!validateForm()) return;
    const regTemp = {
      cpf,
      cod_video: codVideo,
      comentario_pai: comentarioPai || null,
      texto: textoResposta
    };

    try {
      setIsLoading(true)
      await axios.post('/comentarios', regTemp)
      setIsLoading(false)

      toast.success('Comentário postado com sucesso.')

      setTextoResposta('')
      if(comentarioPai) loadRegisters(comentarioPai)
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
    } else if (textoResposta.length < 3 || textoResposta.length > 30) {
      controle = false;
      toast.error('O comentário deve ter entre 3 e 30 caracteres');
    }

    return controle;
  };

  return (
    <div>
      <Loading isLoading={isLoading} />
      <div className='border mt-2 p-1'>
        <label>{title}</label>
        <input type="text" value={textoResposta} onChange={(e) => setTextoResposta(e.target.value)}/>
        <button type='button' onClick={handlePostComment}>Responder</button>
      </div>
    </div>
  );
}

NewComment.defaultProps = {
  codVideo: '',
  cpf: '',
  title: '',
  comentarioPai: '',
  loadRegisters: () => null,
};

NewComment.propTypes = {
  codVideo: PropTypes.string,
  cpf: PropTypes.string,
  title: PropTypes.string,
  comentarioPai: PropTypes.string,
  loadRegisters: PropTypes.func,
};

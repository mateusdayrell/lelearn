import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import axios from '../../services/axios';
import Loading from '../Loading';
import NewComment from '../NewComment';
import CommentList from '../CommentList';

export default function Comments({codVideo, cpf}) {
  const [comentarios, setComentarios] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [comentarioAtivo, setComentarioAtivo] = useState({})

  const [codAtivo, setCodAtivo] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    loadRootComments();
  }, []);

  const loadRootComments = async () => {
    setCodAtivo('')
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/comentarios/root/${codVideo}`);
      setComentarios(data)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const loadRepplyes = async (cod) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/comentarios/${cod}`);

      setRespostas(data.respostas)
      delete data.respostas
      setComentarioAtivo(data)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleShowRespostas = (cod) => {
    setCodAtivo(cod)
    loadRepplyes(cod)
    setComentarios([]);
  }

  const handleShowComentarios = () => {
    setCodAtivo('')
    loadRootComments()
    setRespostas([])
  }

  return (
    <div>
      <Loading isLoading={isLoading} />
      {!codAtivo
        ?
          <>
            <NewComment codVideo={codVideo} cpf={cpf} title="Postar um novo comentário" loadRegisters={loadRootComments} />
            <CommentList comentarios={comentarios} handlePageChange={handleShowRespostas} loadRegisters={loadRootComments} cpf={cpf}/>
          </>
        :
          <>
            <CommentList comentarios={respostas} comentarioAtivo={comentarioAtivo} handlePageChange={handleShowComentarios} loadRegisters={loadRepplyes} cpf={cpf} loadRoot={loadRootComments}/>
            <NewComment codVideo={codVideo} comentarioPai={comentarioAtivo.cod_comentario} cpf={cpf} title="Postar uma nova resposta" loadRegisters={loadRepplyes} />
          </>
        }
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

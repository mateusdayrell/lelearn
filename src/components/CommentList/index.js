import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import axios from '../../services/axios';
import Loading from '../Loading';
import DeleteModal from '../DeleteModal';

export default function CommentList({cpf, comentarios, comentarioAtivo, loadRegisters, handlePageChange, loadRoot}) {
  const [textoEditar, setTextoEditar] = useState('');
  const [isUpdating, setIsUpdating] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingObj, setDeletingObj] = useState('')

  const handleIsUpdating = (comment) => {
    setIsUpdating(comment.cod_comentario)
    setTextoEditar(comment.texto)
  }

  const handleUpdateComment = async (comment) => {
    if (!validateForm()) return;
    const regTemp = {
      cpf,
      cod_video: comment.cod_video,
      comentario_pai: comment.comentario_pai,
      texto: textoEditar
    };

    try {
      setIsLoading(true)
      await axios.put(`/comentarios/${comment.cod_comentario}`, regTemp)
      setIsLoading(false)

      toast.success('Comentário atualizado com sucesso.')

      setTextoEditar('')
      setIsUpdating('')

      if (comment.comentario_pai) loadRegisters(comment.comentario_pai)
      else loadRegisters(comment.cod_comentario)
    } catch (error) {
      setIsLoading(false)
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  }

  const validateForm = () => {
    let controle = true;

    if (!textoEditar) {
      toast.error('Comentário vazio.');
      controle = false;
    } else if (textoEditar.length < 3 || textoEditar.length > 30) {
      controle = false;
      toast.error('O comentário deve ter entre 3 e 30 caracteres');
    }

    return controle;
  };

  const handleIsDeleting = (comment) => {
    setIsUpdating('')
    setTextoEditar('')
    setDeletingObj(comment)
    setIsDeleting(true)
  }

  const handleDelete = async (codigo) => {
    setIsLoading(true);
    try {
      await axios.delete(`/comentarios/${codigo}`);
      setIsLoading(false);

      toast.success('Comentário excluído com sucesso!');
      handleCloseModal()

      if(comentarioAtivo.cod_comentario){
        if(comentarioAtivo.cod_comentario === codigo) await loadRoot()
        else loadRegisters(comentarioAtivo.cod_comentario)
      }
      else await loadRegisters();
    } catch (error) {
      setIsLoading(false);
      const { erros } = error.response.data;
      erros.map((err) => toast.error(err));
    }
  };

  const handleCloseModal = () => {
    setDeletingObj({})
    setIsDeleting(false)
  }

  return (
    <div>
      <Loading isLoading={isLoading} />

      {comentarioAtivo.usuario &&
        <div className='border-2 border-violet-500'>
          <button type='button' onClick={handlePageChange} className='border-2 border-violet-200 p-1 m-3'>Voltar para todos os comentários</button>
          <div>
            <span>{comentarioAtivo.usuario.nome}</span>
            <span>{comentarioAtivo.created_at}</span>
            <span>{comentarioAtivo.created_at !== comentarioAtivo.updated_at && ' (editado)'}</span>
          </div>
          <div>
            {isUpdating === comentarioAtivo.cod_comentario ?
              <div>
                <input
                  type="text"
                  className='w-full'
                  value={textoEditar}
                  onChange={(e) => setTextoEditar(e.target.value)}/>
                <div>
                  <button type='button' onClick={() => handleUpdateComment(comentarioAtivo)} className='text-verde-100'>Salvar</button>
                  <button type='button' onClick={() => setIsUpdating('')} className='text-laranja-100 ml-2'>Cancelar</button>
                </div>
              </div>
            : <div>{comentarioAtivo.texto}</div>
            }
          </div>
          {comentarioAtivo.usuario.cpf === cpf && !isUpdating &&
            <div>
              <button type='button' onClick={() => handleIsUpdating(comentarioAtivo)}>Editar</button>
              <button type='button' onClick={() => handleIsDeleting(comentarioAtivo)}>Excluir</button>
            </div>
          }
        </div>
      }

      {comentarios?.map(comentario => (
        <div key={comentario.cod_comentario}>
          <div className='border-2 my-1 p-2'>
            <p>{comentario.cod_comentario} - {comentario.usuario.nome}</p>
            {isUpdating === comentario.cod_comentario ?
              <div>
                <input
                  type="text"
                  className='w-full'
                  value={textoEditar}
                  onChange={(e) => setTextoEditar(e.target.value)}/>
                <div>
                  <button type='button' onClick={() => handleUpdateComment(comentario)} className='text-verde-100'>Salvar</button>
                  <button type='button' onClick={() => setIsUpdating('')} className='text-laranja-100 ml-2'>Cancelar</button>
                </div>
              </div>
            : <div>{comentario.texto}</div>
            }
            <div>
            {!comentarioAtivo.cod_comentario &&
              <>
                <button
                  type='button'
                  className='text-verde-100'
                  onClick={() => handlePageChange(comentario.cod_comentario)}>
                    {`${comentario.respostas_qtd} Respostas`}
                </button>

                <button
                  type='button'
                  className='pl-3 text-cinza-200'
                  onClick={() => handlePageChange(comentario.cod_comentario)}>
                    Responder
                </button>
              </>
            }
            {cpf === comentario.usuario.cpf &&
              <>
                <button
                  type='button'
                  className='text-azul-100 pl-3'
                  onClick={() => handleIsUpdating(comentario)}>Editar</button>
                <button type='button' onClick={() => handleIsDeleting(comentario)}>Excluir</button>
              </>
            }
            </div>
          </div>
        </div>
      ))}

      <DeleteModal
          showDeleteModal={isDeleting} handleClose={handleCloseModal} deleted
          type="comentario" name={deletingObj.texto} handleDelete={handleDelete} code={deletingObj.cod_comentario}
        />
    </div>
  );
}

CommentList.defaultProps = {
  comentarios: [],
  comentarioAtivo: {},
  cpf: '',
  loadRegisters: () => null,
  handlePageChange: () => null,
  loadRoot: () => null,
};

CommentList.propTypes = {
  comentarios: PropTypes.array,
  comentarioAtivo: PropTypes.object,
  cpf: PropTypes.string,
  loadRegisters: PropTypes.func,
  handlePageChange: PropTypes.func,
  loadRoot: PropTypes.func,
};

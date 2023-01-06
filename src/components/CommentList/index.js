import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'phosphor-react';

import './style.css';
import axios from '../../services/axios';
import Loading from '../Loading';
import DeleteModal from '../DeleteModal';

export default function CommentList({ cpf, comentarios, comentarioAtivo, loadRegisters, handlePageChange, loadRoot }) {
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
    } else if (textoEditar.length < 3 || textoEditar.length > 900) {
      controle = false;
      toast.error('O comentário deve ter entre 3 e 900 caracteres');
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

      if (comentarioAtivo.cod_comentario) {
        if (comentarioAtivo.cod_comentario === codigo) await loadRoot()
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

  const handleDate = (data) => {
    const myDate = new Date(data);
    return (`${  myDate.getDate()  }/${myDate.getMonth() + 1  }/${  myDate.getFullYear()} ${myDate.getHours()}:${myDate.getMinutes()}`);
  }

  return (
    <div>
      <Loading isLoading={isLoading} />

      {comentarioAtivo.usuario &&
        <div>
          <button type='button' onClick={handlePageChange}
            className='text-sm text-cinza-200 hover:text-verde-100 transition-all gap-2 bg-cinza-400 rounded-xl py-1 px-2 flex items-center'>
            <ArrowLeft size={15} />Voltar
          </button>
          <div className='gap-2 flex text-sm items-baseline'>
            <span className='text-verde-100 mt-1'>{comentarioAtivo.usuario.nome}</span>
            <span className='text-cinza-300 text-xs'>{handleDate(comentarioAtivo.created_at)}</span>
            <span>{comentarioAtivo.created_at !== comentarioAtivo.updated_at && ' (editado)'}</span>
            {comentarioAtivo.usuario.cpf === cpf && !isUpdating &&
            <div className='flex text-xs gap-1 text-cinza-200'>
              <button type='button' onClick={() => handleIsUpdating(comentarioAtivo)} className='hover:text-azul-100 transition-all'>Editar</button>
              <button type='button' onClick={() => handleIsDeleting(comentarioAtivo)} className='hover:text-vermelho-100 transition-all'>Excluir</button>
            </div>
          }
          </div>
          <div>
            {isUpdating === comentarioAtivo.cod_comentario ?
              <div>
                <input
                  type="text"
                  className='w-full'
                  value={textoEditar}
                  onChange={(e) => setTextoEditar(e.target.value)} />
                <div>
                  <button type='button' onClick={() => handleUpdateComment(comentarioAtivo)} className='text-verde-100'>Salvar</button>
                  <button type='button' onClick={() => setIsUpdating('')} className='text-laranja-100 ml-2'>Cancelar</button>
                </div>
              </div>
              : <div className='text-cinza-100 text-sm pl-2'>{comentarioAtivo.texto}</div>
            }
          </div>
        </div>
      }

      {comentarios?.map(comentario => (
        <div key={comentario.cod_comentario}>
          <div className='my-2'>
            <div className='flex gap-3'>
              <div className='flex gap-3 items-baseline'>
                <p className='text-verde-100 text-sm'>{comentario.usuario.nome}</p>
                <span className='text-cinza-300 text-xs'>{handleDate(comentario.created_at)}</span>
                <span className='text-cinza-300 text-xs'>{comentario.created_at !== comentario.updated_at && ' (editado)'}</span>
                {cpf === comentario.usuario.cpf &&
                  <div className='flex text-xs gap-1 text-cinza-200'>
                      <button
                        type='button'
                        className='hover:text-azul-100 transition-all'
                        onClick={() => handleIsUpdating(comentario)}>Editar</button>
                      <button
                        type='button'
                        className='hover:text-vermelho-100 transition-all'
                        onClick={() => handleIsDeleting(comentario)}>Excluir</button>
                    </div>
                }
              </div>
            </div>
            <div className='pl-2'>
              {isUpdating === comentario.cod_comentario ?
                <div>
                  <div className='AreaComent'>
                    <input type="text"
                      value={textoEditar}
                      onChange={(e) => setTextoEditar(e.target.value)} />
                    <div className='UnderlineComent' />
                  </div>
                  <div className='flex justify-end gap-2 text-xs text-cinza-200 mt-1'>
                    <button type='button' onClick={() => handleUpdateComment(comentario)} className='bg-cinza-400 py-1 px-2 hover:text-azul-100 rounded-xl'>Salvar</button>
                    <button type='button' onClick={() => setIsUpdating('')} className='bg-cinza-400 py-1 px-2 hover:text-laranja-100 rounded-xl'>Cancelar</button>
                  </div>
                </div>
                : <div className='text-sm text-cinza-200'>{comentario.texto}</div>
              }
              <div>
                {!comentarioAtivo.cod_comentario &&
                  <>
                    <button
                      type='button'
                      className={`${comentario.respostas_qtd === 0 ? 'hidden':'text-cinza-100 text-xs mr-2 hover:text-cinza-300'}`}
                      onClick={() => handlePageChange(comentario.cod_comentario)}>
                      {`${comentario.respostas_qtd} respostas`}
                    </button>

                    <button
                      type='button'
                      className='bg-cinza-400 rounded-xl py-1 px-2 text-cinza-200 text-xs hover:text-verde-100 transition-all'
                      onClick={() => handlePageChange(comentario.cod_comentario)}>
                      Responder
                    </button>
                  </>
                }
              </div>
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

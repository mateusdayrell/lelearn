import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PencilSimple, TrashSimple, PaperPlaneRight, DotsThreeOutlineVertical } from 'phosphor-react';

export default function CommentArea({ ativo, comentario, cpf, editarResposta, textoEditar, setTextoEditar, handleUpdateComment, handleIsUpdating, handleIsDeleting, type }) {
  const [openOptions, setOpenOptions] = useState(false);

  return (
    ativo === comentario.cod_comentario
      ?
      <>

        <textarea className='ModalInput' ref={editarResposta} value={textoEditar} onChange={(e) => setTextoEditar(e.target.value)} />
        <div className='flex gap-2'>
          <button type='button' onClick={() => handleUpdateComment(comentario)} className='flex items-center hover:text-azul-100 transition-all text-xs text-cinza-100'>
            Salvar
          </button>
          <button type='button' onClick={handleIsUpdating} className='flex items-center hover:text-cinza-300 transition-all text-xs text-cinza-100'>
            Cancelar
          </button>
        </div>
      </>
      :
      <div className='flex items-start'>
          <textarea className='ModalInput' readOnly value={comentario.texto} />
          <button type='button' onClick={() => setOpenOptions(!openOptions)} className={`${openOptions === true ? 'text-verde-100':''}text-cinza-100 rounded-full hover:text-verde-100 transition-all -translate-y-5 translate-x-1`}>
            <DotsThreeOutlineVertical size={18} weight="fill" />
          </button>

          <div className={openOptions === true ? 'absolute bg-cinza-400 text-cinza-100 w-30 rounded-md px-4 py-2 text-sm left-[96%] shadow -translate-y-7' : 'hidden'}>
            {comentario.usuario.cpf === cpf &&
              <button type='button' onClick={() => handleIsUpdating(comentario)} className='flex items-center gap-2 hover:text-azul-100 transition-all'>
                <PencilSimple size={15}/>Editar
              </button>
            }
            <button type='button' onClick={() => handleIsDeleting(comentario, type)} className='flex items-center gap-2 hover:text-vermelho-100 transition-all'>
              <TrashSimple size={15}/>Excluir
            </button>
          </div>
        </div>
  );
}

CommentArea.defaultProps = {
  ativo: '',
  cpf: '',
  comentario: {},
  editarResposta: {},
  textoEditar: '',
  type: '',
  setTextoEditar: () => null,
  handleUpdateComment: () => null,
  handleIsUpdating: () => null,
  handleIsDeleting: () => null,
};

CommentArea.propTypes = {
  ativo: PropTypes.string,
  cpf: PropTypes.string,
  comentario: PropTypes.object,
  editarResposta: PropTypes.object,
  textoEditar: PropTypes.string,
  type: PropTypes.string,
  setTextoEditar: PropTypes.func,
  handleUpdateComment: PropTypes.func,
  handleIsUpdating: PropTypes.func,
  handleIsDeleting: PropTypes.func,
};

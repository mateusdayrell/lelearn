import React from 'react';
import PropTypes from 'prop-types';
import { PencilSimple, TrashSimple, PaperPlaneRight } from 'phosphor-react';

export default function CommentArea({ativo, comentario, cpf, editarResposta, textoEditar, setTextoEditar, handleUpdateComment, handleIsUpdating}) {
  return (
    ativo === comentario.cod_comentario
      ?
        <>

          <textarea className='ModalInput' ref={editarResposta} value={textoEditar} onChange={(e) => setTextoEditar(e.target.value)}/>
          <div>
            <button type='button' title='Salvar' onClick={() => handleUpdateComment(comentario)}>
              <PaperPlaneRight size={24} />
            </button>
            <button type='button' title='Cancelar' onClick={handleIsUpdating}>
              Cancelar
            </button>
          </div>
        </>
      :
        <>
          <textarea className='ModalInput' readOnly value={comentario.texto} />
          <div>
            {comentario.usuario.cpf === cpf &&
              <button type='button' title='Editar' onClick={() => handleIsUpdating(comentario)}>
                <PencilSimple size={24}/>
              </button>
            }
            <button type='button' title='Excluir comentário'>
              <TrashSimple size={24} />
            </button>
          </div>
        </>
  );
}

CommentArea.defaultProps = {
  ativo: '',
  cpf: '',
  comentario: {},
  editarResposta: {},
  textoEditar: '',
  setTextoEditar: () => null,
  handleUpdateComment: () => null,
  handleIsUpdating: () => null,
};

CommentArea.propTypes = {
  ativo: PropTypes.string,
  cpf: PropTypes.string,
  comentario: PropTypes.object,
  editarResposta: PropTypes.object,
  textoEditar: PropTypes.string,
  setTextoEditar: PropTypes.func,
  handleUpdateComment: PropTypes.func,
  handleIsUpdating: PropTypes.func,
};

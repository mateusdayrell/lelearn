import React from 'react';
import PropTypes from 'prop-types';
import { MinusCircle } from 'phosphor-react';
import './style.css';

export default function ListCursos({ treinCursos, handleRemove, deleted }) {
  return (
    <div>
      {treinCursos.length > 0 &&
        treinCursos.map((curso, i) => (
          <div key={`mc-${curso.cod_curso}`} className='ContentListCurso'>
            <span>{curso.nome_curso}</span>
            {!deleted &&
              <button
                type='button'
                title='Remover curso'
                onClick={() => handleRemove(i)}
                className="RemoveBtnListCurso">
                <MinusCircle size={22} />
              </button>
            }
          </div>
        ))
      }
    </div>
  );
}

ListCursos.defaultProps = {
  treinCursos: [],
  handleRemove: () => null,
  deleted: false
};

ListCursos.propTypes = {
  treinCursos: PropTypes.array,
  handleRemove: PropTypes.func,
  deleted: PropTypes.bool,
};

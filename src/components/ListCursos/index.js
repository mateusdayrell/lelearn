import React from 'react';
import PropTypes from 'prop-types';

export default function ListCursos({ treinCursos, handleRemove }) {
  return (
    <div>
      {treinCursos.length > 0 &&
        treinCursos.map((curso, i) => (
          <div key={`mc-${curso.cod_curso}`}>
            <span>{curso.nome_curso}</span>
            <button
              type='button'
              title='Remover curso'
              onClick={() => handleRemove(i)}>
                Remover
            </button>
          </div>
        ))
      }
    </div>
  );
}

ListCursos.defaultProps = {
  treinCursos: [],
  handleRemove: () => null,
};

ListCursos.propTypes = {
  treinCursos: PropTypes.array,
  handleRemove: PropTypes.func,
};

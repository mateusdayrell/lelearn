import React from "react";
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { ArrowLeft } from 'phosphor-react';

import './style.css';

export default function CursoDestaque({data}) {
  const history = useHistory();

  const handleRedirect = (cod_curso) => {
    history.push(`/cursos/${cod_curso}`);
  };
  return (
    <div className='DivCursoDestaque'>
      <span className='DivNomeCursoDestaque'><p>{data.nome_curso}</p></span>
      <span className='DivDescCursoDestaque'>
        <span className="DescCursoDestaque">
          <p className="DescCD"><span>{data.desc_curso.length > 60 ? `${data.desc_curso.substring(0,59)}...`:data.desc_curso}</span></p>
          <button
              type='button'
              title='Acessar'
              className='w-8 h-8 rounded-full flex items-center justify-center bg-roxo-100 hover:-rotate-180 duration-300 hover:text-cinza-100'
              onClick={() => handleRedirect(data.cod_curso)}>
              <ArrowLeft size={20} />
            </button>
        </span>
      </span>
    </div>
  );
}

CursoDestaque.defaultProps = {
  data: {},
};

CursoDestaque.propTypes = {
  data: PropTypes.object,
};


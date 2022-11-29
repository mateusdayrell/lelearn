import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { FaFileImage } from 'react-icons/fa';
import { Play } from 'phosphor-react';

import 'moment/locale/pt-br';
import './style.css';

export default function CardCurso({ curso, assistidos, total }) {
  const [percentage, setPercentage] = useState(0);
  const history = useHistory();

  useEffect(() => {
    handlePercentage(assistidos, total);
  }, []);

  const handlePercentage = (watched, totalVideos) => {
    const percent = totalVideos === 0 ? 0 : Math.floor(watched / totalVideos * 100);
    return setPercentage(percent)
  }

  const handleRedirect = (cod_curso) => {
    history.push(`/cursos/${cod_curso}`);
  };

  return (
    <div className=''>

      <div className='w-full items-center flex select-none'>
        <div style={{ width: `${percentage}%` }} className={percentage === 100 ? 'ProgressBarComplete' : 'ProgressBar'}>
          <small className={percentage === 0 ? 'translate-x-5 text-cinza-100 font-thin' : 'translate-x-6 text-cinza-100 font-thin'}>{percentage === 100 ? '' : `${percentage}%`}</small>
        </div>
      </div>

      <div className='ContainerCardCurso'>
        <div key={curso.cod_curso} className="flex items-center gap-3">
          {get(curso, 'nome_arquivo', false) ?
            <img className='h-[110px] w-[150px] min-h-[110px] min-w-[150px]' src={`${process.env.REACT_APP_BACKEND_URL}/images/${curso.nome_arquivo}`} alt="Imagem do curso" />
            : <FaFileImage size={36} />
          }

          <div className='Cursos-info'>
            <h2 className='TitleCardCurso'>{`${curso.nome_curso}`}</h2>
            <p className='DescCurso'>{curso.desc_curso}</p>
          </div>
        </div>
        <div className=''>
          <button
            title='Acessar'
            type='button'
            className='BtnCurso block'
            onClick={() => handleRedirect(curso.cod_curso)}>
          <Play size={20} weight="bold"/>
          </button>
        </div>
      </div>
    </div>
  );
}

CardCurso.defaultProps = {
  curso: {},
  assistidos: 0,
  total: 0,
};

CardCurso.propTypes = {
  curso: PropTypes.object,
  assistidos: PropTypes.number,
  total: PropTypes.number,
};

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
// import { get } from 'lodash';
// import { FaFileImage } from 'react-icons/fa';

import 'moment/locale/pt-br';
import './style.css';
import { ArrowLeft } from 'phosphor-react';

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
    <div className='w-80 h-64'>
      <div className={percentage === 100 ? 'w-40 flex items-center select-none' : 'flex items-center select-none'}>
        <div style={{ width: `${percentage}%` }} className={percentage === 100 ? 'ProgressBarCompleteCurso' : 'ProgressBarCurso'}>
          <small className='font-thin'>{percentage === 100 ? 'Concluído' : `${percentage}%`}</small>
        </div>
      </div>

      <div className='ContainerCardCurso'>
        <div className='w-full'>
          <svg width="320" height="119" viewBox="0 0 320 119">
            <path className='drop-shadow-sm' d="M0 12C0 5.37257 5.37258 0 12 0H308.355C314.839 0 320.046 5.17344 319.181 11.5996C317.089 27.1333 309.721 54.8763 283.99 73.3732C246.562 100.278 188.438 57.7099 119.915 91.8764C38.9567 132.244 10.16 117.445 2.39916 110.783C0.655595 109.287 0 107.02 0 104.723V12Z"
              fill="url(#paint0_linear_673_1687)" />
            <defs>
              <linearGradient id="paint0_linear_673_1687" x1="68.9037" y1="30.1469" x2="203.981" y2="83.8291" gradientUnits="userSpaceOnUse">
                <stop stop-color="#8338EC" /> {/* eslint-disable-line */}
                <stop offset="0.889541" stop-color="#4D149D" /> {/* eslint-disable-line */}
              </linearGradient>
            </defs>
          </svg>
          <h1 className='TitleCardCurso'>{curso.nome_curso}</h1>
        </div>

        <div className='px-4 h-full w-full'>
          <div className='text-xs w-2/2 text-cinza-200 max-h-20 min-h-max h-20'><p>{curso.desc_curso}</p></div>

          <div className='w-full flex justify-end'>
            <button
              type='button'
              title='Acessar'
              className='w-8 h-8 rounded-full flex items-center justify-center bg-roxo-100 hover:-rotate-180 duration-300 hover:text-cinza-100'
              onClick={() => handleRedirect(curso.cod_curso)}>
              <ArrowLeft size={20} />
            </button>
          </div>
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

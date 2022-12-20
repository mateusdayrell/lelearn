import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import 'moment/locale/pt-br';
import { ArrowLeft } from 'phosphor-react';

import { useHistory } from 'react-router-dom';

import './styles.css';

export default function CardTreinamento({ treinamento }) {
  const history = useHistory();
  const [percentage, setPercentage] = useState('');

  moment.locale('pt-br');

  useEffect(() => {
    handlePercentage(treinamento.cursos_concluidos, treinamento.total_cursos);
  }, []);

  const handleRedirect = (cod_treinamento) => {

    history.push(`/treinamentos/${cod_treinamento}`);
  };

  const handlePercentage = (watched, total) => {
    const percent = total == 0 ? 0 : Math.floor(watched / total * 100); // eslint-disable-line
    // if (percent === Infinity) return setPercentage(0);
    return setPercentage(percent)
  }

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
              fill={`${treinamento.cor}`} />
          </svg>
          <h1 className='TitleCardTreinamento'>{treinamento.nome_treinamento}</h1>
        </div>

        <div className='px-4 h-full w-full'>
          <div className='text-xs w-2/2 text-cinza-200 max-h-20 min-h-max h-20'>
            <p>{treinamento.prazo === null
                ? <p style={{color:`${treinamento.cor}`}} className='PrazoList'>Prazo não determinado</p>
                : <p style={{color:`${treinamento.cor}`}} className='PrazoList'>{moment(treinamento.prazo, 'YYYY-MM-DD HH:mm:ss').format('LL')}</p>
              }</p>
            <p>{treinamento.desc_treinamento}</p>
          </div>

          <div className='w-full flex justify-end'>
          <button
            type='button'
            className='w-8 h-8 rounded-full text-cinza-500 flex items-center justify-center shadow hover:-rotate-180 duration-500'
            title='Acessar'
            style={{background:`${treinamento.cor}`}}
            onClick={() => handleRedirect(treinamento.cod_treinamento)}>
            <ArrowLeft size={20}/>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CardTreinamento.defaultProps = {
  treinamento: {},
};

CardTreinamento.propTypes = {
  treinamento: PropTypes.object,
};

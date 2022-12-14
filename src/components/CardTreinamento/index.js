import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CaretRight } from 'phosphor-react';
import moment from 'moment/moment';
import 'moment/locale/pt-br';

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
    const percent = total == 0 ? 0 : Math.floor(watched / total * 100);
    // if (percent === Infinity) return setPercentage(0);
    return setPercentage(percent)
  }

  return (
    <div style={{border:`1px solid ${treinamento.cor}`,borderRadius:'3px'}} className='CardContainer'>
      <div className={percentage === 100 ? 'w-16 flex items-center select-none':'flex items-center select-none'}>
        <div style={{ width: `${percentage}%` }} className={percentage === 100 ? 'ProgressBarComplete' : 'ProgressBar'}>
          <small className='font-thin'>{percentage === 100 ? 'Concluído' : `${percentage}%`}</small>
        </div>
      </div>
      <div className='Card'>
        <div className='h-[75%] px-3 py-1 flex flex-col'>
          <div className='flex flex-col'>
           <small>
              {treinamento.prazo === null
                ? <p style={{color:`${treinamento.cor}`}} className='PrazoList'>Prazo não determinado</p>
                : <p style={{color:`${treinamento.cor}`}} className='PrazoList'>{moment(treinamento.prazo, 'YYYY-MM-DD HH:mm:ss').format('LL')}</p>
              }
            </small>
            <span style={{color:`${treinamento.cor}`}} className={`${percentage === 100 ? 'NomeTreinamentoComplete' : 'NomeTreinamento'}`}>{treinamento.nome_treinamento}</span>
            <small className='DescTreinamento'>{treinamento.desc_treinamento}</small>
          </div>
        </div>
        <div className='w-full flex justify-end text-black px-3'>
          <button
            type='button'
            className='BtnCardTreinamento'
            style={{background:`${treinamento.cor}`}}
            onClick={() => handleRedirect(treinamento.cod_treinamento)}>
            <p>Acessar</p>
          </button>
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

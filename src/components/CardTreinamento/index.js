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
    handlePercentage(treinamento.cursos_assistidos, treinamento.total_cursos);
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
    <div className='CardContainer'>
      <div className='ContainerLeftCard'>
        <div className='w-full flex items-center'>
          <div style={{ width: `${percentage}%` }} className={percentage === 100 ? 'ProgressBarComplete':'ProgressBar'}>
            <small className={percentage === 0 ? 'translate-x-5 text-cinza-100 font-thin':' font-semibold text-cinza-500'}>{percentage === 100 ? 'Completo':`${percentage}%`}</small>
          </div>
        </div>
        <div className='h-[75%] px-3 py-1 flex flex-col'>
          <div className='flex flex-col'>
            <small>
              {treinamento.prazo === null
                ? <p className='PrazoListAzul'>Prazo não determinado</p>
                : <p className='PrazoListAmarelo'>{moment(treinamento.prazo, 'YYYY-MM-DD HH:mm:ss').format('LL')}</p>
              }
            </small>
            <span className={`${percentage === 100 ? 'NomeTreinamentoComplete':'NomeTreinamento'}`}>{treinamento.nome_treinamento}</span>
            <small className='DescTreinamento'>{treinamento.desc_treinamento}</small>
          </div>
        </div>
        <div className='w-full flex justify-end text-black px-1'>
          <button
            type='button'
            className='BtnCardTreinamento'
            onClick={() => handleRedirect(treinamento.cod_treinamento)}>
            <span><CaretRight size={20} /></span>Acessar
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

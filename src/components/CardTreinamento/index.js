import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { CaretRight } from 'phosphor-react';
import moment from 'moment/moment';
import { useHistory } from 'react-router-dom';

import './styles.css';

export default function CardTreinamento({ treinamento }) {
  const history = useHistory();
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    handlePercentage(treinamento.cursos_assistidos,treinamento.total_cursos);
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
        <div className='w-full'>
          <div style={{width: `${percentage}%`}} className="bg-vermelho-100">{percentage}</div>
        </div>
        <div className='h-[80%] px-3 py-1 flex flex-col'>
          <div className='flex flex-col'>
            <small>{treinamento.cursos_assistidos}</small>
            <small>{treinamento.total_cursos}</small>
            <small>
              {treinamento.prazo === null
                ? <p className='PrazoListAzul'>Prazo não determinado</p>
                : <p className='PrazoListAmarelo'>{moment(treinamento.prazo).format('LL')}</p>
              }
            </small>
            <span className='NomeTreinamento'>{treinamento.nome_treinamento}</span>
            {/* <small className='DescTreinamento'>{treinamento.desc_treinamento}</small> */}
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

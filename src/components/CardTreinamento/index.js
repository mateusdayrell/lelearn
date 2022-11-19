import React from 'react';
import PropTypes from 'prop-types';
import { CaretRight } from 'phosphor-react';
import moment from 'moment/moment';
import { useHistory } from 'react-router-dom';

import './styles.css';

export default function CardTreinamento({ treinamento }) {
  const history = useHistory();

  const handleRedirect = (cod_treinamento) => {
    history.push(`/treinamentos/${cod_treinamento}`);
  };

  const handlePercentage = (watched,total) => {
    const percentage = watched/total * 100;
    return percentage
  }
  return (
    <div className='CardContainer'>
      <div className='ContainerLeftCard'>
        <div className='h-[80%] px-3 py-1 flex flex-col'>
          <div className='flex flex-col'>
            <small>
              {treinamento.prazo === null
                ? <p className='PrazoListAzul'>Prazo não determinado</p>
                : <p className='PrazoListAmarelo'>{moment(treinamento.prazo).format('LL')}</p>
              }
            </small>
            <small>{handlePercentage(treinamento.cursos_assistidos,treinamento.total_cursos) === 100 ? 'Concluido':'Em andamento'}</small>
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

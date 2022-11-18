import React from 'react';
import PropTypes from 'prop-types';
import { Lightning } from 'phosphor-react';
import moment from 'moment/moment';
import { useHistory } from 'react-router-dom';

import './styles.css';

export default function CardTreinamento({ treinamento }) {
  const history = useHistory();

  const handleRedirect = (cod_treinamento) => {
    history.push(`/treinamentos/${cod_treinamento}`);
  };

    return (
        <div className='CardContainer'>
            <div className='ContainerLeftCard'>
                <div className='h-[75%] px-3 py-1 flex flex-col'>
                    <div className='flex flex-col'>
                        <small>
                          {treinamento.prazo === null
                            ? <p className='PrazoListAzul'>Prazo não determinado</p>
                            : <p className='PrazoListAmarelo'>{moment(treinamento.prazo).format('DD-MM-YYYY')}</p>
                          }
                        </small>
                        <span className='NomeTreinamento'>{treinamento.nome_treinamento}</span>
                        <small className='DescTreinamento'>{treinamento.desc_treinamento}</small>
                    </div>
                </div>
                <div className='w-full pl-3 text-black'>
                    <button
                      type='button'
                      className='BtnCardTreinamento'
                      onClick={() => handleRedirect(treinamento.cod_treinamento)}>
                        <Lightning size={20} />Acessar
                      </button>
                </div>
            </div>
            <div className='ContainerRightCard'/>
        </div>
    );
}

CardTreinamento.defaultProps = {
    treinamento: {},
};

CardTreinamento.propTypes = {
    treinamento: PropTypes.object,
};

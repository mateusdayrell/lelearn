import React from 'react';
import PropTypes from 'prop-types';
import { Lightning } from 'phosphor-react';
import moment from 'moment/moment';
import './styles.css';

export default function CardTreinamento({ treinamento }) {
    console.log(treinamento);
    return (
        <div className='CardContainer'>
            <div className='TopCard'></div>
            <div className='h-[75%] p-3 flex flex-col'>
                <div className='flex flex-col'>
                    <span className='text-xs text-cinza-200'>{treinamento.prazo === null ? 'Prazo não determinado': moment(treinamento.prazo).format('DD-MM-YYYY')}</span>
                    <span className='NomeTreinamento'>{treinamento.nome_treinamento}</span>
                    <small className='DescTreinamento'>{treinamento.desc_treinamento}</small>
                </div>
            </div>
            <div className='w-full flex items-center justify-center'>
                <button className='BtnCardTreinamento'><Lightning size={20} />Acessar</button>
            </div>
        </div>
    );
}

CardTreinamento.defaultProps = {
    treinamento: {},
};

CardTreinamento.propTypes = {
    type: PropTypes.object,
};

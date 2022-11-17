import React from 'react';
import PropTypes from 'prop-types';
import { Lightning } from 'phosphor-react';
import moment from 'moment/moment';
import './styles.css';

export default function CardTreinamento({ treinamento }) {
    return (
        <div className='CardContainer'>
            <div className='ContainerLeftCard'>
                <div className='h-[75%] px-3 py-1 flex flex-col'>
                    <div className='flex flex-col'>
                        <small>{treinamento.prazo === null ? <p className='PrazoListAzul'>Prazo não determinado</p> : <p className='PrazoListAmarelo'>{moment(treinamento.prazo).format('DD-MM-YYYY')}</p>} </small>
                        <span className='NomeTreinamento'>{treinamento.nome_treinamento}</span>
                        <small className='DescTreinamento'>{treinamento.desc_treinamento}</small>
                    </div>
                </div>
                <div className='w-full pl-3 text-black'>
                    <button className='BtnCardTreinamento'><Lightning size={20} />Acessar</button>
                </div>
            </div>
            <div className='ContainerRightCard'>
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

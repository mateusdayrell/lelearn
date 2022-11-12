import React from 'react';
import PropTypes from 'prop-types';
import { Lightning } from 'phosphor-react';
import './styles.css';

export default function CardTreinamento({ treinamento }) {
    return (
        <div className='CardContainer'>
            <div className='TopCard'>
                <span className='text-md'>{treinamento.nome_treinamento}</span>
            </div>
            <div className='h-full w-full p-2'>
                <div className='w-full flex items-center justify-center'>
                <button className='BtnCardTreinamento'><Lightning size={20} />Acessar</button>
                </div>
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

import React from 'react';
import PropTypes from 'prop-types';
import { Lightning } from 'phosphor-react';
import './styles.css';

export default function CardTreinamento({ treinamento }) {
    return (
        <div className='CardContainer'>
            <div className='TopCard'></div>
            <div className='h-[75%] p-3 flex flex-col'>
                <div className='flex flex-col'>
                    <span className='text-xs text-cinza-200'>Prazo do Usuário</span>
                    <span className='NomeTreinamento'>{treinamento.nome_treinamento}</span>
                    <small>{treinamento.desc_treinamento}</small>
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

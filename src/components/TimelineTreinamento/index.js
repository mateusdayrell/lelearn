import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import 'moment/locale/pt-br';

import { useHistory } from 'react-router-dom';

import './style.css';
import { ArrowLeft, ArrowRight } from 'phosphor-react';

export default function TimelineTreinamento({ treinamento }) {
    const history = useHistory();

    moment.locale('pt-br');

    const handleRedirect = (cod_treinamento) => {
        history.push(`/treinamentos/${cod_treinamento}`);
    };

    return (
        <>
            {treinamento.prazo === null
            // && treinamento.prazo < moment().format()
                ? <div className='hidden'/>
                : <div className='w-full bg-cinza-350 p-2 flex items-center justify-between border-b-2 border-vermelho-100 rounded'>
                    <div className='flex flex-col'>
                        <small className='text-cinza-200 text-xs'>{moment(treinamento.prazo, 'YYYY-MM-DD HH:mm:ss').format('L')}</small>
                        <span className='text-laranja-100 text-sm font-light'>{treinamento.nome_treinamento}</span>
                    </div>
                    <button
                        type='button'
                        className='w-8 h-8 bg-cinza-200 rounded-full text-cinza-500 flex items-center justify-center shadow hover:-rotate-180 duration-500 hover:text-cinza-100 hover:bg-cinza-300'
                        title='Acessar'
                        onClick={() => handleRedirect(treinamento.cod_treinamento)}>
                        <ArrowLeft size={20} />
                    </button>
                </div>}
        </>
    );
}

TimelineTreinamento.defaultProps = {
    treinamento: {},
};

TimelineTreinamento.propTypes = {
    treinamento: PropTypes.object,
};
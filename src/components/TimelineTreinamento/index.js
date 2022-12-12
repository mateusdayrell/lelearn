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
                ? <div className='hidden'></div>
                : <div className='w-full bg-cinza-350 p-2 flex items-center justify-between border-b-2 border-laranja-100'>
                    <div className='flex flex-col'>
                        <small className='text-vermelho-100 text-xs'>{moment(treinamento.prazo, 'YYYY-MM-DD HH:mm:ss').format('L')}</small>
                        <span className='uppercase test-sm text-cinza-100'>{treinamento.nome_treinamento}</span>
                    </div>
                    <button
                        type='button'
                        className='w-8 h-8 bg-cinza-100 rounded-full text-cinza-500 flex items-center justify-center shadow hover:-rotate-180 duration-500'
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
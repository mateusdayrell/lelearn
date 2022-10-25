import React from 'react';
import PropTypes from 'prop-types';
import { ArrowClockwise } from 'phosphor-react';

import './style.css';

export default function Loading({ isLoading }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoading) return <></>;
  return (
    <div className="loading-container">
      <div/>
      <ArrowClockwise size={32} className='icon'/>
      <span>Carregando...</span>
    </div>
  );
}

Loading.defaultProps = {
  isLoading: false,
};

Loading.propTypes = {
  isLoading: PropTypes.bool,
};

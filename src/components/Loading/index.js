import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

export default function Loading({ isLoading }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoading) return <></>;
  return (
    <div className="loading-container">
      <div />
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

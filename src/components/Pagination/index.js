import React, { useState } from "react";
import PropTypes from 'prop-types';

function Pagination({total, itemsPerPage, handleNewPage, maxButtons}) {
  const totalPages = Math.ceil(total / itemsPerPage)
  const [currentPage, setCurrentPage] = useState(1)

  const handleClick = (i) => {
    setCurrentPage(i + 1)
    const novoInicio = (i * itemsPerPage)
    const novoFim = (novoInicio + itemsPerPage)
    handleNewPage(novoInicio, novoFim)
  }

  return(
    <div>
      {Array.from({length: totalPages}).map((el, index) => (
        index === 0 || index === totalPages-1 ||
        index === currentPage || index === currentPage || index === currentPage - 1 || index === currentPage - 2 ?
        <button
          className="btn"
          type="button"
          onClick={() => handleClick(index)}
        >
          {index + 1}
        </button>
        : ''
      ))}
    </div>
  )
}

Pagination.defaultProps = {
  total: 0,
  itemsPerPage: 0,
  maxButtons: 5,
  handleNewPage: () => null,
};

Pagination.proptotals = {
  total: PropTypes.number,
  itemsPerPage: PropTypes.number,
  maxButtons: PropTypes.number,
  handleNewPage: PropTypes.func,
};

export default Pagination

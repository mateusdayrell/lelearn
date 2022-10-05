import React from 'react';
import PropTypes from 'prop-types';

export default function OrderSelect({ nameKey, handleOrderChange, searchOrdem, array }) {

  const handleChange = (valor) => {
    const newArr = [...array]
    const [key, order] = (valor.split(" "))
    let controle = 1

    if(order === "desc") controle *= -1

    newArr.sort((a, b) => {
      if (a[key].toLowerCase() > b[key].toLowerCase()) {
        return controle;
      }
      if (a[key].toLowerCase() < b[key].toLowerCase()) {
        return (controle * -1);
      }

      return 0;
    });

    handleOrderChange(newArr, valor)
  }

  return (
    <div className="order-select flex gap-2 items-center text-sm max-w-min">
      <span>
        <label className='text-white text font-extralight text-xs'>Ordem</label>
      </span>
      <span className='border-b border-gray-300 bg-transparent'>
        <select
          className="border-none text-[white] bg-transparent text-xs "
          name="ordem"
          defaultValue={searchOrdem}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="" disabled selected={searchOrdem === ''}>
            Ordenar por
          </option>
          <option className='text-gray-900' value={`${nameKey} asc`} selected={searchOrdem === `${nameKey} asc`}>A-z</option>
          <option className='text-gray-900' value={`${nameKey} desc`}>Z-a</option>
          <option className='text-gray-900' value="created_at asc">Mais antigo primeiro</option>
          <option className='text-gray-900' value="created_at desc">Mais recente primeiro</option>
        </select>
      </span>
    </div>
  );
}

OrderSelect.defaultProps = {
  nameKey: '',
  searchOrdem: '',
  handleOrderChange: () => null,
  array: []
};

OrderSelect.propTypes = {
  nameKey: PropTypes.string,
  searchOrdem: PropTypes.string,
  handleOrderChange: PropTypes.func,
  array: PropTypes.array
};

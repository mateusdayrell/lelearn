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
      <span className='bg-transparent'>
        <select
          className="border-none text-[white] bg-transparent text-xs "
          name="ordem"
          defaultValue={searchOrdem}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="" disabled> Ordenar por </option>
          <option className='text-gray-900 bg-transparent' value={`${nameKey} asc`}>A-Z</option>
          <option className='text-gray-900 bg-transparent' value={`${nameKey} desc`}>Z-A</option>
          <option className='text-gray-900 bg-transparent' value="updated_at asc">Data de inclusão (Mais antigo)</option>
          <option className='text-gray-900 bg-transparent' value="updated_at desc">Data de inclusão (Mais recente)</option>
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

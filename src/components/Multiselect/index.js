import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'phosphor-react';

import { formatUserObj } from '../../helpers/formatUserObj'

export default function Multiselect({ type, listaArr, array, setArray, value, label }) {
  const verifyEqual = (cod) => {
    let controle = false

    array.forEach(element => {
      if(element[value] === cod) controle = true
    });

    return controle
  }

  const handleOrder = (arr) => {
    arr.sort((a, b) => a[label] > b[label] ? 1 : -1) // ordenar por nome
  }

  const handleAdd = (valueSelect) => {
    const tempArr = [...array]
    const item = JSON.parse(valueSelect)

    if (type === 'usuário') tempArr.push(formatUserObj(item))
    else tempArr.push(item)

    handleOrder(tempArr)

    setArray(tempArr)
    document.getElementById(`select-${type}`).selectedIndex = 0 // resetar valor do select apos selecionar
  }

  const handleRemove = (index) => {
    const tempArr = [...array]
    tempArr.splice(index, 1)
    setArray(tempArr)
  }

  return (
      <div className="my-2 p-1 flex flex-col gap bg-[#323238] rounded svelte-1l8159u">
        <div className="flex max-w-2xl overflow-scroll max-h-24 flex-wrap">
          {array.map((item, index) => (
                <div
                  key={`sup${item[value]}${type}`}
                  className="flex flex-none justify-center items-center m-1 py-1.5 px-2.5 rounded-full text-gray-50 bg-verde-100 hover:bg-verde-200 border border-gray-400 hover:border-verde-200 gap-1 flex-wrap"
                >
                  <div className="text-xs leading-none max-w-full flex-initial">
                    {item[label]}
                  </div>
                  <div className="flex flex-auto">
                      <button type='button' className='hover:text-red-500' title={`Remover ${type}`} onClick={() => handleRemove(index)}>
                        <X weight="bold" />
                      </button>
                  </div>
                </div>
              ))
            }
        </div>

        <div className="flex-1 border-b border-gray-300 pt-2">
          <select
            name={type}
            id={`select-${type}`}
            defaultValue=""
            onChange={e => handleAdd(e.target.value)}>
              <option value="" disabled>Selecione um {type}</option>
              {listaArr.length > 0
                ? listaArr.map((el) => (
                    <option
                      key={`inf${el[value]}${type}`}
                      value={JSON.stringify(el)}
                      className={verifyEqual(el[value]) ? "bg-verde-100 text-gray-50" : ''} disabled={verifyEqual(el.cpf)}
                    >
                      {el[label]}
                    </option>
                  ))
                : ''}
          </select>
        </div>
      </div>
  );
}

Multiselect.defaultProps = {
  type: 'usuarios',
  listaArr: [],
  array: [],
  setArray: () => null,
  value: 'cpf',
  label: 'nome',
};

Multiselect.propTypes = {
  type: PropTypes.string,
  listaArr: PropTypes.array,
  array: PropTypes.array,
  setArray: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string,
};

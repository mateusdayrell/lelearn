import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'phosphor-react';

export default function Multiselect({ type, arrLista, arrSuperior, value, label, handleMultiSelectChange, handleMultiSelectRemove }) {
  const verifyEqual = (cod) => {
    let controle = false

    arrSuperior.forEach(element => {
      if(element[value] === cod) controle = true
    });

    return controle
  }

  const handleIsChanging = (eventValue) => {
    handleMultiSelectChange(type, eventValue)
    document.getElementById(`select-${type}`).selectedIndex = 0 // resetar valor do select apos selecionar
  }

  return (
      <div className="my-2 p-1 flex flex-col gap bg-[#323238] rounded svelte-1l8159u">
        <div className="flex max-w-2xl overflow-scroll max-h-24 flex-wrap">
          {arrSuperior.map((trein) => (
                <div
                  key={`sup${trein[value]}${type}`}
                  className="flex flex-none justify-center items-center m-1 py-1.5 px-2.5 rounded-full text-gray-50 bg-verde-100 hover:bg-verde-200 border border-gray-400 hover:border-verde-200 gap-1 flex-wrap"
                >
                  <div className="text-xs leading-none max-w-full flex-initial pt-1">
                    {trein[label]}
                  </div>
                  <div className="flex flex-auto">
                      <button type='button' className='hover:text-red-600 hover:text-lg' title={`Remover ${type}`} onClick={() => handleMultiSelectRemove(type, trein[value])}>
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
            onChange={e => handleIsChanging(e.target.value)}>
              <option value="" disabled>Selecione um {type}</option>
              {arrLista.length > 0
                ? arrLista.map((el) => (
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
  arrLista: [],
  arrSuperior: [],
  value: 'cpf',
  label: 'nome',
  handleMultiSelectChange: () => null,
  handleMultiSelectRemove: () => null,
};

Multiselect.propTypes = {
  type: PropTypes.string,
  arrLista: PropTypes.array,
  arrSuperior: PropTypes.array,
  value: PropTypes.string,
  label: PropTypes.string,
  handleMultiSelectChange: PropTypes.func,
  handleMultiSelectRemove: PropTypes.func,
};

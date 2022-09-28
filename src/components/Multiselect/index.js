import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineClose } from "react-icons/ai";

export default function Multiselect({ type, array, treinamento, value, label, handleSelectChange, handleSelectRemove }) {
  const verifyEqual = (cod) => {
    let controle = false

    treinamento.forEach(element => {
      if(element[value] === cod) controle = true
    });

    return controle
  }

  const handleIsChanging = (eventValue) => {
    handleSelectChange(type, eventValue)
    document.getElementById(`select-${type}`).selectedIndex = 0 // resetar valor do select apos selecionar
  }

  return (
      <div className="my-2 p-1 flex flex-col gap bg-[#323238] rounded svelte-1l8159u">
        <div className="flex flex-auto flex-wrap">
          {treinamento.map((trein) => (
                <div
                  key={trein[value]}
                  className="flex justify-center items-center m-1 py-1 px-2 rounded-full text-gray-100 bg-verde-100 border border-gray-400 gap-1"
                >
                  <div className="text-xs leading-none max-w-full flex-initial">
                    {trein[label]}
                  </div>
                  <div className="flex flex-auto">
                      <button type='button' onClick={() => handleSelectRemove(type, trein[value])}>
                          <AiOutlineClose/>
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
            onChange={e => handleIsChanging(e.target.value)}>
              <option value="" disabled selected>Selecione um {type === 'usuarios' ? 'usuário' : 'curso'}</option>
              {array.length > 0
                ? array.map((el) => (
                    <option
                      key={el[value]}
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
  array: [],
  treinamento: [],
  value: 'cpf',
  label: 'nome',
  handleSelectChange: () => null,
  handleSelectRemove: () => null,
};

Multiselect.propTypes = {
  type: PropTypes.string,
  array: PropTypes.array,
  treinamento: PropTypes.array,
  value: PropTypes.string,
  label: PropTypes.string,
  handleSelectChange: PropTypes.func,
  handleSelectRemove: PropTypes.func,
};

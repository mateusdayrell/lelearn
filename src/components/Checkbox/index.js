import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'phosphor-react';

export default function Checkbox({cId, cValue, handleCheckbox, checked}) {

  return (
    <div className="flex z-10">
      <input
        type="checkbox"
        id={cId}
        value={cValue}
        onChange={e => handleCheckbox(e.target.value)}
        checked={checked}
        className="peer hidden"
      />
      <label
        htmlFor={cId}
        className="select-none cursor-pointer rounded-full border-2 border-gray-200
          h-8 w-8 font-bold text-gray-300 transition-colors duration-200 ease-in-out
          peer-checked:bg-green-400 peer-checked:text-gray-900 peer-checked:shadow-[0_0_5px_green]
          peer-checked:border-gray-200 flex items-center justify-center"
      >
        <Check size={18} weight="bold"/>
      </label>
    </div>
  );
}

Checkbox.defaultProps = {
  cId: '',
  cValue: 'value',
  handleCheckbox: () => null,
  checked: false,
};

Checkbox.propTypes = {
  cId: PropTypes.string,
  cValue: PropTypes.string,
  handleCheckbox: PropTypes.func,
  checked: PropTypes.bool,
};

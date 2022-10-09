import React from 'react';
import { FileArrowUp, ImageSquare } from 'phosphor-react';
import PropTypes from 'prop-types';

export default function FileInput({handleShowFile, foto}) {
  return (
      <label className="cursor-pointer flex justify-around items-center bg-[#323238] my-2 mx-6 font-light text-sm">
        <div className='flex flex-col items-center'>
          <FileArrowUp color='#00B37E'size={32} />
          <p className="mt-2 text-xs leading-normal text-cinza-200">{foto ? "Alterar foto" : "Selecione uma foto"}</p>
          <input type='file' className="hidden" onChange={handleShowFile} />
        </div>
        <div className='flex'>
          {foto ?
            <img src={foto} className="h-28 w-34" alt="Imagem do curso" />
          :
          <div className='flex flex-col items-center'>
            <ImageSquare color='#00B37E' size={32} />
            <p className="mt-2 text-xs text-cinza-300">Nenhuma foto</p>
            <p className="text-xs text-cinza-300">selecionada</p>
          </div> }
        </div>
    </label>
  );
}

FileInput.defaultProps = {
  handleShowFile: () => null,
  foto: ''
};

FileInput.propTypes = {
  handleShowFile: PropTypes.func,
  foto: PropTypes.array
};


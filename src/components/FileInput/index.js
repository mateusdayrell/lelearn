import React from 'react';
import { CloudArrowUp, ImageSquare, TrashSimple } from 'phosphor-react';
import PropTypes from 'prop-types';

export default function FileInput({handleShowFile, foto, removeFoto}) {
  return (
      <div className="flex justify-around gap-3 items-center bg-[#323238] my-2 mx-6 font-light text-sm">
        <div className={`${foto ? `` : `cursor-pointer `   }flex flex-col items-center gap-3`} >
          <label htmlFor='input-foto' className='cursor-pointer flex flex-col items-center justify-center'>
            {foto ? '' : <CloudArrowUp className='cursor-pointer' size={32} />}
            <label
              htmlFor='input-foto'
              className={`${foto ? `border border-verde-100 w-36 px-1 py-1 rounded-lg hover:text-white hover:bg-verde-100` : ``   } flex gap-3 justify-center cursor-pointer`}>
                {foto ? "Alterar foto "  : "Selecione uma foto"} {foto ? <CloudArrowUp size={20} /> : ''}
            </label>
            <input type='file' id='input-foto' className="hidden" onChange={handleShowFile} />
          </label>

          {foto ?
            <button
              type='button'
              onClick={() => removeFoto()}
              className='flex justify-center gap-3 w-36 px-1 border border-verde-100 py-1 rounded-lg hover:text-white hover:bg-verde-100'>
                Remover foto <TrashSimple size={20} />
            </button>
          : ''}
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
    </div>
  );
}

FileInput.defaultProps = {
  handleShowFile: () => null,
  foto: '',
  removeFoto: () => null,
};

FileInput.propTypes = {
  handleShowFile: PropTypes.func,
  foto: PropTypes.string,
  removeFoto: PropTypes.func,
};


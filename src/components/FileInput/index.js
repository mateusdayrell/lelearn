import React from 'react';
import { CloudArrowUp, ImageSquare, TrashSimple } from 'phosphor-react';
import PropTypes from 'prop-types';
import './style.css';

export default function FileInput({ handleShowFile, foto, removeFoto, deleted }) {
  return (
    <div className="ContentFileInput">
      {!deleted  &&
        <div className={`${foto ? `` : ``} LabelInputFile`} >
          <label
            htmlFor='input-foto'
            className='LabelInputFoto-Options'>
            {foto ? '' : <CloudArrowUp size={30} />}
            <label
              htmlFor='input-foto'
              className={`${foto ? `AlterFoto` : `TextSelectFoto`}`}>
              {foto ? "Alterar foto " : "Selecione uma foto"} {foto ? <CloudArrowUp size={20} /> : ''}
            </label>
            <input
              type='file'
              id='input-foto'
              className="hidden"
              onChange={handleShowFile}
            />
          </label>

          {foto ?
            <button
              type='button'
              onClick={() => removeFoto()}
              className='RemoveFoto bg-vermelho-100'>
              Remover foto <TrashSimple size={20} />
            </button>
            : ''}
        </div>
      }

      <div className='flex'>
        {foto ?
          <img src={foto} className="h-28 w-34" alt="Imagem do curso" />
          :
          <div className='FileNone'>
            <ImageSquare size={32} />
            <p>Nenhuma foto</p>
            <p>selecionada</p>
          </div>}
      </div>
    </div>
  );
}

FileInput.defaultProps = {
  handleShowFile: () => null,
  foto: '',
  removeFoto: () => null,
  deleted: false,
};

FileInput.propTypes = {
  handleShowFile: PropTypes.func,
  foto: PropTypes.string,
  removeFoto: PropTypes.func,
  deleted: PropTypes.bool,
};


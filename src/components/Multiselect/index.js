/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';

import ListUsuarios from '../ListUsuarios';
import ListCursos from '../ListCursos';
import ListVideos from '../ListVideos';

export default function Multiselect({ type, listaArr, array, setArray, value, label, deleted }) {
  const verifyEqual = (cod) => {
    let controle = false

    array.forEach(element => {
      if (element[value] === cod) controle = true
    });

    return controle
  }

  const handleAdd = (valueSelect) => {
    const tempArr = [...array]
    const item = JSON.parse(valueSelect)

    if (value === 'cpf') tempArr.push(formatObj(item))
    else tempArr.push(item)

    if (value !== 'cod_video') handleOrder(tempArr)

    setArray(tempArr)
    document.getElementById(`select-${type}`).selectedIndex = 0 // resetar valor do select apos selecionar
  }

  const handleRemove = (index) => {
    const tempArr = [...array]
    tempArr.splice(index, 1)
    setArray(tempArr)
  }

  const handleOrder = (arr) => {
    arr.sort((a, b) => a[label] > b[label] ? 1 : -1) // ordenar por nome
  }

  const formatObj = (item) => {
    const obj = { ...item }
    if (value === "cpf") {
      obj.treinamentos_usuarios = {
        prazo: null
      }
    }
    if (value === "cod_video") {
      obj.cursos_videos = {
        ordem: null
      }
    }
    return obj
  }

  return (
    <div className="my-1 flex flex-col gap rounded">
      <div className="flex-1 border-none">
        {!deleted &&
          <select
            name={type}
            id={`select-${type}`}
            defaultValue=""
            onChange={e => handleAdd(e.target.value)}>
            <option value="" disabled>Selecione um {type}</option>
            {listaArr.length > 0
              ? listaArr.map((el) => (
                <option
                  key={`ms-${el[value]}${type}`}
                  value={JSON.stringify(el)}
                  className={verifyEqual(el[value]) ? "bg-verde-100 text-gray-50" : ''} disabled={verifyEqual(el.cpf)}
                >
                  {el[label]}
                </option>
              ))
              : ''}
          </select>
        }
      </div>

      <div className='max-h-[20em] overflow-auto'>
        {value === "cpf" ?
          <ListUsuarios treinUsuarios={array} setTreinUsuarios={setArray} handleRemove={handleRemove} deleted={deleted} />
          : value === "cod_curso" ?
            <ListCursos treinCursos={array} handleRemove={handleRemove} deleted={deleted} />
            : value === "cod_video" ?
              <ListVideos videos={array} setVideos={setArray} handleRemove={handleRemove} deleted={deleted} />
              : ''}
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
  deleted: false,
};

Multiselect.propTypes = {
  type: PropTypes.string,
  listaArr: PropTypes.array,
  array: PropTypes.array,
  setArray: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string,
  deleted: PropTypes.bool,
};

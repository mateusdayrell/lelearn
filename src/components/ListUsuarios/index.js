import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';

export default function ListUsuarios({ treinUsuarios, setTreinUsuarios, handleRemove }) {

  const [showInput, setShowInput] = useState('')

  const handleData = (date, index) => {
    const arr = [...treinUsuarios]

    const dateFormat = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD")
    arr[index].treinamentos_usuarios.prazo = dateFormat

    setTreinUsuarios(arr)
  }

  const clearData = (index) => {
    const arr = [...treinUsuarios]
    arr[index].treinamentos_usuarios.prazo = null
    setTreinUsuarios(arr)
    setShowInput('')
  }

  return (
        treinUsuarios.length > 0 &&
          treinUsuarios.map((usuario, i) => (
            <div
              key={`mu${usuario.cpf}`}
              className='flex mx-6 my-1 p-2 bg-[#323238] justify-between'
            >
              <div>{usuario.nome}</div>
              <div>
                {usuario.treinamentos_usuarios.prazo || showInput === usuario.cpf ?
                  <>
                    <input
                      type="date"
                      value={moment(usuario.treinamentos_usuarios.prazo).format('YYYY-MM-DD')}
                      onChange={e => handleData(e.target.value, i)}
                      />
                    <button
                      type='button'
                      title='Cancelar'
                      onClick={() => clearData(i)}
                    >
                      {usuario.treinamentos_usuarios.prazo ? "Limpar" : "Cancelar"}
                    </button>
                  </>
                :
                  <button
                    type='button'
                    title='Definir prazo'
                    onClick={() => setShowInput(usuario.cpf)}>
                      Definir prazo
                  </button>
                }
                <button
                  type='button'
                  title='Remover usuário'
                  onClick={() => handleRemove(i)}>
                    Remover
                </button>
              </div>
            </div>
          ))
  );
}

ListUsuarios.defaultProps = {
  treinUsuarios: [],
  setTreinUsuarios: () => null,
  handleRemove: () => null,
};

ListUsuarios.propTypes = {
  treinUsuarios: PropTypes.array,
  setTreinUsuarios: PropTypes.func,
  handleRemove: PropTypes.func,
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CaretLeft } from 'phosphor-react';
import moment from 'moment/moment';

import Multiselect from '../Multiselect';

export default function UsuarioList({ usuarios, treinUsuarios, setTreinUsuarios, handleMultiSelectChange, handleMultiSelectRemove, setForm }) {

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

  const handleRemove = (index) => {
    const tempArr = [...treinUsuarios]
    tempArr.splice(index, 1)
    setTreinUsuarios(tempArr)
  }

  return (
      <div className="ModalContent">
        <div className='flex items-center pb-2 mb-2 mx-6 rounded-t-md gap-2'>
          <button
            type='button'
            className='text-verde-100 hover:text-verde-200'
            onClick={() => setForm(0)}
            title='Voltar'>
              <CaretLeft size={32} weight="bold" />
          </button>
          <h2 className='text-verde-100'>Usuários</h2>
        </div>

        <div className="InputArea">
          <label>Vincular usuários <small>(opcional)</small></label>
            <Multiselect
              type="usuário"
              listaArr={usuarios}
              array={treinUsuarios}
              setArray={setTreinUsuarios}
              value="cpf"
              label="nome"
              handleMultiSelectChange={handleMultiSelectChange}
              handleMultiSelectRemove={handleMultiSelectRemove}
            />
        </div>

        {treinUsuarios.length > 0 &&
          treinUsuarios.map((usuario, i) => (
            <div
              key={`list${usuario.cpf}`}
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
        }
      </div>
  );
}

UsuarioList.defaultProps = {
  usuarios: [],
  treinUsuarios: [],
  setTreinUsuarios: () => null,
  handleMultiSelectChange: () => null,
  handleMultiSelectRemove: () => null,
  setForm: 0,
};

UsuarioList.propTypes = {
  usuarios: PropTypes.array,
  treinUsuarios: PropTypes.array,
  setTreinUsuarios: PropTypes.func,
  handleMultiSelectChange: PropTypes.func,
  handleMultiSelectRemove: PropTypes.func,
  setForm: PropTypes.number,
};

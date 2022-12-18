import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MinusCircle, CalendarPlus } from 'phosphor-react';
import moment from 'moment/moment';
import './style.css';

export default function ListUsuarios({ treinUsuarios, setTreinUsuarios, handleRemove, deleted }) {

  const [showInput, setShowInput] = useState('')

  const handleData = (date, index) => {
    const arr = [...treinUsuarios]

    const dateFormated = moment(date, 'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")
    arr[index].treinamentos_usuarios.prazo = dateFormated
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
      <div key={`mu${usuario.cpf}`} className='ContentListUser'>
        <div className='ListUserName'>{usuario.nome}</div>
        {!deleted &&
          <div className='ListUserOptions'>
            {usuario.treinamentos_usuarios.prazo || showInput === usuario.cpf ?
              <>
                <input type="date" value={moment(usuario.treinamentos_usuarios.prazo, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')} onChange={e => handleData(e.target.value, i)} />
                <button
                  type='button'
                  onClick={() => clearData(i)}
                  className="hover:text-vermelho-100 transition-all"
                >
                  {usuario.treinamentos_usuarios.prazo ? "Excluir Prazo" : "Cancelar"}
                </button>
              </>
              :
              <button
                type='button'
                title='Definir prazo'
                onClick={() => setShowInput(usuario.cpf)}
                className="DateBtnListUser">
                <CalendarPlus size={22} />
              </button>
            }
            <button
              type='button'
              title='Remover'
              onClick={() => handleRemove(i)}
              className="RemoveBtnListUser">
              <MinusCircle size={22} />
            </button>
          </div>
        }
      </div>
    ))
  );
}

ListUsuarios.defaultProps = {
  treinUsuarios: [],
  setTreinUsuarios: () => null,
  handleRemove: () => null,
  deleted: false,
};

ListUsuarios.propTypes = {
  treinUsuarios: PropTypes.array,
  setTreinUsuarios: PropTypes.func,
  handleRemove: PropTypes.func,
  deleted: PropTypes.bool,
};

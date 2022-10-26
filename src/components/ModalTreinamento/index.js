import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, CaretLeft } from 'phosphor-react';
import Modal from 'react-modal';
import Multiselect from '../Multiselect';

export default function ModalTreinamento({ shwoFormModal, handleClose, isUpdating, codTreinamento, setCodTreinamento, nome, setNome, descricao, setDescricao, usuarios, treinUsuarios,
cursos, treinCursos, handleMultiSelectChange, handleMultiSelectRemove, clearModal, handleSubmit  }) {

  const [form, setForm] = useState(1)

  useEffect(() => {
    setForm(1)
  }, [isUpdating]);

  return (
    <Modal
          isOpen={shwoFormModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="ModalHeader">
            <span>{isUpdating ? 'Editar' : 'Cadastrar'} treinamento</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              <X size={24}/>
            </button>
          </div>

          {isUpdating && form === 0 &&
            <div className="ModalContent">
              <div className="form-gestao-video">
                {isUpdating ?
                  <div className="InputArea">
                    <label>Código</label>
                    <input
                      type="text"
                      className='ModalInput'
                      name="cod_treinamento"
                      placeholder="Código"
                      disabled={!!isUpdating}
                      value={codTreinamento}
                      onChange={(e) => setCodTreinamento(e.target.value)}
                    />
                  </div>
                  : ''}

                <div className="InputArea">
                  <label>Nome</label>
                  <input
                    type="text"
                    className='ModalInput'
                    name="nome"
                    placeholder="Nome"
                    maxLength="40"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className="InputArea">
                  <label>Descrição <small>(opcional)</small></label>
                  <textarea
                    name="descricao"
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>

                <div className="InputArea">
                  <label>Vincular usuários <small>(opcional)</small></label>
                  <Multiselect
                    type="usuario"
                    arrLista={usuarios}
                    arrSuperior={treinUsuarios}
                    value="cpf"
                    label="nome"
                    handleMultiSelectChange={handleMultiSelectChange}
                    handleMultiSelectRemove={handleMultiSelectRemove}
                  />
                </div>

                  <button
                    type="button"
                    className="buttonpassword"
                    onClick={() => setForm(1)}>
                      Usuários
                  </button>

                  <button
                    type="button"
                    className="buttonpassword"
                    onClick={() => setForm(2)}>
                      Cursos
                  </button>

                <div className="InputArea">
                  <label>Vincular cursos <small>(opcional)</small></label>
                  <Multiselect
                    type="curso"
                    arrLista={cursos}
                    arrSuperior={treinCursos}
                    value="cod_curso"
                    label="nome_curso"
                    handleMultiSelectChange={handleMultiSelectChange}
                    handleMultiSelectRemove={handleMultiSelectRemove}
                  />
                </div>

              </div>
            </div>
          }

          {isUpdating && form === 1 &&
            <div className="ModalContent">
              <div className='flex  items-center pb-2 mb-2 mx-6 rounded-t-md gap-2'>
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
                    type="usuario"
                    arrLista={usuarios}
                    arrSuperior={treinUsuarios}
                    value="cpf"
                    label="nome"
                    handleMultiSelectChange={handleMultiSelectChange}
                    handleMultiSelectRemove={handleMultiSelectRemove}
                  />
              </div>

              {treinUsuarios.length > 0 &&
                treinUsuarios.map(usuario => (
                  <div key={usuario.cpf} className='flex'>
                    <div>{usuario.nome}</div>
                    <div>
                      {usuario.treinamentos_usuarios.prazo ?
                        <input type="date"/>
                      : <button>Definir prazo</button>}
                    </div>
                  </div>
                ))
              }
            </div>
          }

          {isUpdating && form === 2 &&
            <div className="ModalContent">
              <div className='flex  items-center pb-2 mb-2 mx-6 rounded-t-md gap-2'>
                <button
                  type='button'
                  className='text-verde-100 hover:text-verde-200'
                  onClick={() => setForm(0)}
                  title='Voltar'>
                    <CaretLeft size={32} weight="bold" />
                </button>
                <h2 className='text-verde-100'>Cursos</h2>
              </div>

              <div className="InputArea">
                <label>Vincular cursos <small>(opcional)</small></label>
                <Multiselect
                  type="curso"
                  arrLista={cursos}
                  arrSuperior={treinCursos}
                  value="cod_curso"
                  label="nome_curso"
                  handleMultiSelectChange={handleMultiSelectChange}
                  handleMultiSelectRemove={handleMultiSelectRemove}
                />
              </div>

              <div className="InputArea">
                {treinCursos.length > 0 &&
                  treinCursos.map(curso => (
                    <div key={curso.cod_curso}>{curso.nome_curso}</div>
                  ))
                }
              </div>
            </div>
          }

          <div className="ModalFooter">
            <button className="red-btn" type="button" onClick={() => clearModal("limpar")}>
              Limpar
            </button>
            <button className="green-btn" type="button" onClick={handleSubmit}>
              {isUpdating ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </Modal>
  );
}

ModalTreinamento.defaultProps = {
  shwoFormModal: false,
  handleClose: () => null,
  isUpdating: false,
  codTreinamento: '',
  setCodTreinamento: () => null,
  nome: '',
  setNome: () => null,
  descricao: '',
  setDescricao: () => null,
  usuarios: [],
  treinUsuarios: [],
  cursos: [],
  treinCursos: [],
  handleMultiSelectChange: () => null,
  handleMultiSelectRemove: () => null,
  clearModal: () => null,
  handleSubmit: () => null,
};

ModalTreinamento.propTypes = {
  shwoFormModal: PropTypes.bool,
  handleClose: PropTypes.func,
  isUpdating: PropTypes.bool,
  codTreinamento: PropTypes.string,
  setCodTreinamento: PropTypes.func,
  nome: PropTypes.string,
  setNome: PropTypes.func,
  descricao: PropTypes.string,
  setDescricao: PropTypes.func,
  usuarios: PropTypes.array,
  treinUsuarios: PropTypes.array,
  cursos: PropTypes.array,
  treinCursos: PropTypes.array,
  handleMultiSelectChange: PropTypes.func,
  handleMultiSelectRemove: PropTypes.func,
  clearModal: PropTypes.func,
  handleSubmit: PropTypes.func,
};

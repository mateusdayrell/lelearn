import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { X } from 'phosphor-react';

export default function DeleteModal({showDeleteModal, handleClose, type, name, handleDelete, code}) {
  return (
    <Modal
          isOpen={showDeleteModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="ModalHeader">
            <span>Excluir {type}</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          <div className="ModalContent">
            <div className="FormDelete">
              <p>
                Caso prossiga com a exclusão do item, o mesmo não será mais
                recuperado.
              </p>
              <p>
                Deseja realmente excluir o {type} <i>{name}</i> ?
              </p>
            </div>
          </div>

          <div className="ModalFooter">
            <button
              className="GrayBtn"
              type="button"
              onClick={handleClose}>
              Cancelar
            </button>
            <button
              className="RedBtn"
              type="button"
              onClick={() => handleDelete(code)}
            >
              Excluir
            </button>
          </div>
        </Modal>
  );
}

DeleteModal.defaultProps = {
  showDeleteModal: false,
  handleClose: () => null,
  type: '',
  name: '',
  handleDelete: () => null,
  code: '',
};

DeleteModal.propTypes = {
  showDeleteModal: PropTypes.bool,
  handleClose: PropTypes.func,
  type: PropTypes.string,
  name: PropTypes.string,
  handleDelete: PropTypes.func,
  code: PropTypes.string,
};

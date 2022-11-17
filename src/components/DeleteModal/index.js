import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { X } from 'phosphor-react';

export default function DeleteModal({showDeleteModal, handleClose, type, deleted, name, handleDelete, code}) {
  return (
    <Modal
          isOpen={showDeleteModal}
          onRequestClose={handleClose}
          className="Modal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="ModalHeader">
            <span>{deleted ? 'Excluir' : 'Desativar'} {type}</span>
            <button className="CloseModal" type="button" onClick={handleClose}>
              <X size={24} />
            </button>
          </div>
          <div className="ModalContent">
            <div className="FormDelete">
            {deleted
              ?
                <p>
                  Deseja realmente excluir o {type}: <i>{name}</i>?
                  Esta ação será irreversível.
                </p>
              :
                <p>
                  Caso desative o {type}, o mesmo não será mais
                  recuperado.
                  Deseja realmente desativar o {type} <i>{name}</i> ?
                </p>
            }
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
              {deleted ? 'Excluir' : 'Desativar'}
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
  deleted: false,
};

DeleteModal.propTypes = {
  showDeleteModal: PropTypes.bool,
  handleClose: PropTypes.func,
  type: PropTypes.string,
  name: PropTypes.string,
  handleDelete: PropTypes.func,
  code: PropTypes.string,
  deleted: PropTypes.bool
};

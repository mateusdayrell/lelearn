import React from 'react';
import { BellSimple, X } from 'phosphor-react';
import PropTypes from 'prop-types';
// import { useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useDispatch } from 'react-redux';

// import axios from '../../services/axios';
// import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function Notifications({ openSidebar, openNotify, setOpenNotify }) {
  // const location = useLocation();
  // const dispatch = useDispatch();

  // const [notificacoes, setNotificacoes] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   loadRegisters();
  // }, [location]);

  // useEffect(() => {
  //   loadRegisters();
  // }, []);

  // const loadRegisters = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data } = await axios.get(`/notificacoes/get-by-user/${cpf}`);

  //     setNotificacoes(data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     setIsLoading(false);
  //     const { erros } = error.response.data;
  //     erros.map((err) => toast.error(err));

  //     if (error.response.status === 401) {
  //       dispatch(actions.loginFailure());
  //       history.push('/login');
  //     }
  //   }
  // };

  return (
    <div className={` ${ openSidebar ? 'NotifyContentClosed' : 'NotifyContentOpen'} NotifyContent`}>
      <button type="button" onClick={() => setOpenNotify(!openNotify)}>
        <BellSimple
          size={24}
          className={`${openNotify === true && 'text-verde-100'} icons`}/>
        <span className={`${openSidebar? 'hidden': `${openNotify === true ? 'text-verde-100' : ''}` } name`}>
          Notificações
        </span>
      </button>

      <div className={ openNotify === true && openSidebar === true
            ? `absolute p-2 w-60 h-2/3 rounded-md bg-cinza-400 bottom-4 -right-64 shadow-md border border-cinza-300`
            : `${openNotify
                  ? 'absolute p-2 w-60 h-2/3 rounded-md bg-cinza-400 bottom-4 -right-64 shadow-md border border-cinza-300'
                  : ''}` }
      >
        <span className={`${openNotify === true && openSidebar === true? '': `${openNotify ? '' : 'hidden'}`} flex justify-between`}>
          Notificações
          <X
            size={22}
            onClick={() => setOpenNotify(!openNotify)}
            className="cursor-pointer hover:text-cinza-200 transition-all"/>
        </span>
      </div>
    </div>
  );
}

Notifications.defaultProps = {
  openSidebar: false,
  openNotify: false,
  setOpenNotify: () => null,
};

Notifications.propTypes = {
  openSidebar: PropTypes.bool,
  openNotify: PropTypes.bool,
  setOpenNotify: PropTypes.func,
};

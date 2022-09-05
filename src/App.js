import React from 'react';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // toasts
import { Provider } from 'react-redux'; // redux
import { PersistGate } from 'redux-persist/integration/react'; // redux

import store, { persistor } from './store'; // redux
import history from './services/history';
import Routes from './routes';
import './global.css';
import 'react-toastify/dist/ReactToastify.css'; // toasts
//import 'bootstrap/dist/css/bootstrap.min.css'; // bootstrap

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Routes />
          <ToastContainer autoClose={3000} className="toast-container" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

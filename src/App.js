import React from 'react';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // toasts
import { Provider } from 'react-redux'; // redux
import { PersistGate } from 'redux-persist/integration/react'; // redux

import store, { persistor } from './store'; // redux
import history from './services/History';
import Routes from './routes';
import Navbar from './components/navbar';
import './global.css';
import 'react-toastify/dist/ReactToastify.css'; // toasts

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Navbar />
          <Routes />
          <ToastContainer autoClose={3000} className="toast-container" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

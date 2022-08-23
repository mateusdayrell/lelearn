import React from 'react';
import { Switch } from 'react-router-dom';

import MyRoute from './MyRoute';
import Login from '../pages/Login';
import Error from '../pages/Error';

export default function Routes() {
  return (
    <Switch>
      <MyRoute exact path="/" component={Login} isClosed />
      <MyRoute exact path="/login" component={Login} />
      <MyRoute exact path="/usuarios" component={Login} />
      <MyRoute path="*" component={Error} />
    </Switch>
  );
}

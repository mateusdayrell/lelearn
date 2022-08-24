import React from 'react';
import { Switch } from 'react-router-dom';

import MyRoute from './MyRoute';
import Login from '../pages/Login';
import Video from '../pages/Video';
import Curso from '../pages/Curso';
import Treinamento from '../pages/Treinamento';
import Error from '../pages/Error';

export default function Routes() {
  return (
    <Switch>
      <MyRoute exact path="/" component={Login} />
      <MyRoute exact path="/login" component={Login} />
      <MyRoute exact path="/treinamentos" component={Treinamento} isClosed />
      <MyRoute exact path="/curso" component={Curso} isClosed />
      <MyRoute exact path="/video/:id" component={Video} />
      <MyRoute path="*" component={Error} />
    </Switch>
  );
}

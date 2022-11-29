/* eslint-disable prettier/prettier */
import React from 'react';
import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MyRoute from './MyRoute';
import Login from '../pages/Login';
import RecuperarSenha from '../pages/RecuperarSenha';
import Home from '../pages/Home';
import Video from '../pages/Video';
import Cursos from '../pages/Cursos';
import Curso from '../pages/Curso';
import Treinamento from '../pages/Treinamento';
import Error from '../pages/Error';
import Usuario from '../pages/Admin/Usuario';
import GestaoVideos from '../pages/Admin/GestaoVideos';
import GestaoCursos from '../pages/Admin/GestaoCursos';
import GestaoTreinamentos from '../pages/Admin/GestaoTreinamentos';
import Treinamentos from '../pages/Treinamentos';

export default function Routes() {
  const tipoUsuario = useSelector((state) => state.auth.usuario.tipo); // TIPO -> 0 === ADMINISTRADOR, TIPO -> 1 === USUARIO COMUM
  return (
    <>
      {(tipoUsuario === 0 || !tipoUsuario) && // ADMINISTRADOR
        <Switch>
          <MyRoute exact path="/usuarios" component={Usuario} isClosed />
          <MyRoute exact path="/gestao-videos" component={GestaoVideos} isClosed />
          <MyRoute exact path="/gestao-cursos" component={GestaoCursos} isClosed />
          <MyRoute exact path="/gestao-treinamentos" component={GestaoTreinamentos} isClosed />

          <MyRoute exact path="/" component={Home} isClosed/>
          <MyRoute exact path="/login" component={Login} />
          <MyRoute exat path="/recuperar-senha" component={RecuperarSenha} />
          <MyRoute exact path="/treinamentos" component={Treinamentos} isClosed />
          <MyRoute exact path="/treinamentos/:cod_treinamento" component={Treinamento} isClosed />
          <MyRoute exact path="/cursos/:cod_curso" component={Curso} isClosed />
          <MyRoute exact path="/cursos" component={Cursos} isClosed />
          <MyRoute exact path="/videos/:cod_curso/:cod_video" component={Video} isClosed />
          <MyRoute path="*" component={Error}/>
        </Switch>
      }

      {tipoUsuario === 1 && // USUARIO COMUM
        <Switch>
          <MyRoute exact path="/" component={Home} />
          <MyRoute exact path="/login" component={Login} />
          <MyRoute exat path="/recuperar-senha" component={RecuperarSenha} />
          <MyRoute exact path="/treinamentos" component={Treinamentos} isClosed />
          <MyRoute exact path="/treinamentos/:cod_treinamento" component={Treinamento} isClosed />
          <MyRoute exact path="/cursos/:cod_curso" component={Curso} isClosed />
          <MyRoute exact path="/cursos" component={Cursos} isClosed />
          <MyRoute exact path="/videos/:cod_curso/:cod_video" component={Video} isClosed />
          <MyRoute path="*" component={Error} />
        </Switch>
      }
    </>
  );
}

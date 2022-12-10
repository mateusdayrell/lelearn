/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import axios from '../../../services/axios';
import Loading from '../../../components/Loading';

export default function Relatorios() {
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/relatorios/usuario/13211615229');
      setIsLoading(false);
      console.log(data);
      setUrl(data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      // const { erros } = error.response.data;
      // erros.map((err) => toast.error(err));
    }
  };



  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container-body g-curso-container">
      <form action="http://localhost:3333/relatorios/usuario/13211615229" method="get" target="_blank">
        <label htmlFor="fname">First name:</label>
        <input type="text" id="fname" name="fname"/>
        <label htmlFor="lname">Last name:</label>
        <input type="text" id="lname" name="lname"/>
        <input type="submit" value="Submit"/>
      </form>
      </div>
    </>
  );
}

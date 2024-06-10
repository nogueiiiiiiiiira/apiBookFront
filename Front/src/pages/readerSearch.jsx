import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBiblioteca } from '../api/server';

export function ReaderSearch() {
  const [readers, setReaders] = useState(null);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    apiBiblioteca.get(`/readers/${search}`)
    .then(response => {
        if (response.data.results) {
          setReaders(response.data.results);
          setErrorMessage(null);
        }
      })
    .catch((error) => {
        if (error.response.status === "404") {
          setErrorMessage('Nenhum leitor encontrado! Tente procurar outro termo!');
        }
        if (error.response.status === "500") {
          setErrorMessage('Erro de conexão!');
        }
        console.error(error);
      });
  }, [search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    apiBiblioteca.get(`/readers/${search}`)
    .then(response => {
        setReaders(response.data);
        setErrorMessage(null);
      })
    .catch(error => {
        console.error(error);
        setErrorMessage('Ocorreu um erro ao buscar o leitor. Pesquise outro termo!');
      });
  };

  return (
    <div>
      <h1>Leitores</h1>
      <form onSubmit={handleSubmitSearch}>
        <input type="text" value={search} onChange={handleSearch} placeholder="Buscar leitor" />
        <button type="submit">Buscar</button>
      </form>
      {errorMessage && (
        <p>{errorMessage}</p>
      )}
      {readers && (
        <ul>
          {readers.map(reader => (
            <li key={reader.id}>
              <h2>{reader.nome}</h2>
              <p>ID: {reader.id}</p>
              <p>Nome: {reader.nome}</p>
              <p>CPF: {reader.cpf}</p>
              <p>Email: {reader.email}</p>
              <p>Telefone: {reader.telefone}</p>
              <p>Data de Nascimento: {reader.dataNasc}</p>
              <p>Criado Em: {reader.criadoEm}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReaderSearch;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBiblioteca } from '../api/server';

export function LibrarianSearch() {
  const [librarians, setLibrarians] = useState(null);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    apiBiblioteca.get(`/librarians/${search}`)
    .then(response => {
        if (response.data.results) {
          setLibrarians(response.data.results);
          setErrorMessage(null);
        }
      })
    .catch((error) => {
        if (error.response.status === "404") {
          setErrorMessage('Nenhum bibliotecario encontrado! Tente procurar outro termo!');
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
    apiBiblioteca.get(`/librarians/${search}`)
    .then(response => {
        setLibrarians(response.data);
        setErrorMessage(null);
      })
    .catch(error => {
        console.error(error);
        setErrorMessage('Ocorreu um erro ao buscar o bibliotecario. Pesquise outro termo!');
      });
  };

  return (
    <div>
      <h1>Bibliotecario</h1>
      <form onSubmit={handleSubmitSearch}>
        <input type="text" value={search} onChange={handleSearch} placeholder="Buscar bibliotecario" />
        <button type="submit">Buscar</button>
      </form>
      {errorMessage && (
        <p>{errorMessage}</p>
      )}
      {librarians && (
        <ul>
          {librarians.map(librarian => (
            <li key={librarian.id}>
              <h2>{librarian.nome}</h2>
              <p>ID: {librarian.id}</p>
              <p>Nome: {librarian.nome}</p>
              <p>CPF: {librarian.cpf}</p>
              <p>Email: {librarian.email}</p>
              <p>Telefone: {librarian.telefone}</p>
              <p>Data de Nascimento: {librarian.dataNasc}</p>
              <p>Criado Em: {librarian.criadoEm}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LibrarianSearch;
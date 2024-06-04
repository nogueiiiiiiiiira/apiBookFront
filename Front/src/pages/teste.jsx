import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBiblioteca } from '../api/server';
import Card from '../components/Card';

export function BookSearch() {
  const [books, setBooks] = useState(null);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    apiBiblioteca.get(`/books/${search}`)
    .then(response => {
        if (response.data.results) {
          setBooks(response.data.results);
          setErrorMessage(null);
        }
      })
    .catch((error) => {
        if (error.response.status === "404") {
          setErrorMessage('Nenhum livro encontrado! Tente procurar outro termo!');
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

  const handleSubmit = (event) => {
    event.preventDefault();
    apiBiblioteca.get(`/books/${search}`)
    .then(response => {
        setBooks(response.data);
        setErrorMessage(null);
      })
    .catch(error => {
        console.error(error);
        setErrorMessage('Ocorreu um erro ao buscar o livro. Pesquise outro termo!');
      });
  };

  return (
    <div>
      <h1>Livros</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={search} onChange={handleSearch} placeholder="Buscar livro" />
        <button type="submit">Buscar</button>
      </form>
      {errorMessage && (
        <p>{errorMessage}</p>
      )}
      {books && (
        <ul>
          {books.map(book => (
            <li key={book.id}>
              <h2>{book.nome}</h2>
              <p>ID: {book.id}</p>
              <p>Autor: {book.autor}</p>
              <p>Categoria: {book.categoria}</p>
              <p>Descrição: {book.descricao}</p>
              <p>Estoque: {book.estoque}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookSearch;
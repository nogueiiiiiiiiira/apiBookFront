import React, { useState } from 'react';
import axios from 'axios';
import { apiBiblioteca } from '../api/server';
import Card from '../components/Card';

export const Books = () => {
  const [books, setBooks] = useState(null);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [newBook, setNewBook] = useState({
    nome: '',
    autor: '',
    categoria: '',
    descricao: '',
    estoque: 0
  });

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiBiblioteca.get(`/books/${search}`)
   .then(response => {
        if (!response.data.results) {
          setErrorMessage('Nenhum livro encontrado! Tente procurar outro termo!');
        } else {
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
  };

  const handleCreateBook = (event) => {
    event.preventDefault();
    apiBiblioteca.post(`/book`, newBook)
   .then(response => {
        setErrorMessage(null);
        setNewBook({
          nome: '',
          autor: '',
          categoria: '',
          descricao: '',
          estoque: 0
        });
        alert('Livro criado com sucesso!');
      })
   .catch((error) => {
        setErrorMessage('Erro ao criar livro!');
        console.error(error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({...newBook, [name]: value });
  };

  return (
    <div>
      <h1>Livros</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={search} onChange={handleSearch} placeholder="Buscar livro" />
        <button type="submit">Buscar</button>
      </form>
      <h2>Criar novo livro</h2>
      <form onSubmit={handleCreateBook}>
        <label>
          Nome:
          <input type="text" name="nome" value={newBook.nome} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Autor:
          <input type="text" name="autor" value={newBook.autor} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Categoria:
          <input type="text" name="categoria" value={newBook.categoria} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Descrição:
          <textarea name="descricao" value={newBook.descricao} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Estoque:
          <input type="number" name="estoque" value={newBook.estoque} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Criar livro</button>
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

export default Books;
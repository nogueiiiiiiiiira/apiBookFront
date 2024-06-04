import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";

export function Books() {
  const [content, setContent] = useState(<BookList showForm={showForm} />);

  function showList() {
    setContent(<BookList showForm={showForm} />);
  }

  function showForm(book) {
    setContent(<BookForm book={book} showList={showList} />);
  }

  return (
    <div className="container my-5">
      {content}
    </div>
  );
}

function BookList(props) {
  const [books, setBooks] = useState([]);

  function fetchBooks() {
    apiBiblioteca.get(`/books`)
     .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response");
        }
        return response.json();
      })
     .then((data) => {
        setBooks(data);
      })
     .catch((error) => console.log(error.message));
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  function deleteBook(id) {
    apiBiblioteca.delete(`/book/${id}`)
     .then((response) => response.json())
     .then((data) => fetchBooks());
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Livros</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Livro
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Estoque</th>
            <th>Criado Em</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => {
            return (
              <tr key={index}>
                <td>{book.id}</td>
                <td>{book.nome}</td>
                <td>{book.autor}</td>
                <td>{book.categoria}</td>
                <td>{book.estoque}</td>
                <td>{book.criadoEm}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(book)}
                    className="btn btn-primary btn-sm me-2"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="btn btn-danger btn-sm"
                    type="button"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function BookForm(props) {
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const book = Object.fromEntries(formData.entries());

 

    if (props.book.id) {
      apiBiblioteca.put(`/book/${props.book.id}`)
       .then((response) => {
          if (!response.ok) {
            throw new Error("Unexpected Server Response");
          }
          return response.json();
        })
       .then((data) => {
          props.showList();
    setErrorMessage("");
        })
      .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      book.createdAt = new Date().toISOString().slice(0, 10);
      apiBiblioteca.post(`/book`)
      .then((response) => {
          if (!response.ok) {
            throw new Error("Unexpected Server Response");
          }
          return response.json();
        })
      .then((data) => {
          props.showList();
          setErrorMessage("");
        })
      .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">
        {props.book.id? "Editar Livro" : "Criar Novo Livro"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage}

          <form onSubmit={(event) => handleSubmit(event)}>
            {props.book.id && (
              <div className="row mb-3">
                <label className="col-sm4 col-form-label">ID</label>
                <div className="col-sm-8">
                  <input
                    readOnly
                    name="id"
                    type="text"
                    className="form-control-plaintext"
                    defaultValue={props.book.id}
                    placeholder="ID"
                  />
                </div>
              </div>
            )}

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Título</label>
              <div className="col-sm-8">
                <input
                  name="titulo_nome"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.titulo_nome}
                  placeholder="Título"
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Autor</label>
              <div className="col-sm-8">
                <input
                  name="autor_nome"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.autor_nome}
                  placeholder="Autor"
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Descrição</label>
              <div className="col-sm-8">
                <input
                  name="descricao"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.descricao}
                  placeholder="Descrição"
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Categoria</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  name="categoria"
                  defaultValue={props.book.categoria}
                >
                  <option value="Other">Other</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Action">Action</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Estoque</label>
              <div className="col-sm-8">
                <input
                  name="estoque"
                  type="number"
                  className="form-control"
                  defaultValue={props.book.estoque}
                  placeholder="Estoque"
                />
              </div>
            </div>

            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button className="btn btn-primary btn-sm me-3" type="submit">
                  Salvar
                </button>
              </div>
              <div className="col-sm-4 d-grid">
                <button
                  onClick={() => props.showList()}
                  className="btn btn-secondary me-2"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Books;
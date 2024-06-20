import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Books() {
  const [content, setContent] = useState(<BookList showForm={showForm} />);

  function showList() {
    setContent(<BookList showForm={showForm} />);
  }

  function showForm(book) {
    setContent(<BookForm book={book} showList={showList} />);
  }

  return (
    <>
    <Menu />
    <div className="container my-5">
      {content}
    </div>
    </>
  );
}

function BookList(props) {
  const [books, setBooks] = useState([]);

  function fetchBooks() {
    apiBiblioteca.get(`/books`)
    .then((response) => {
        console.log(response);
        if (!response.ok && response.status!== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error('Invalid response from server');
        }
      })
    .then((data) => {
        setBooks(data);
      })
    .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchBooks();
  }, []);
  
  function deleteBook(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este livro?");
    if (confirmDelete) {apiBiblioteca.delete(`/books/${id}`)
     .then((response) => {
        if (!response.ok) {
          fetchBooks();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
     .catch((error) => console.error(error)); 
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Livros</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Livro
      </button>
      <br />
      <br />
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
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
          books.map((book, index) => {
            return (
              <tr key={index}>
                <td>{book.id}</td>
                <td>{book.nome}</td>
                <td>{book.autor}</td>
                <td>{book.descricao}</td>
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
  const [newBook, setNewBook] = useState(props.book? props.book : {
    nome: '',
    autor: '',
    descricao: '',
    categoria: '',
    estoque: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({...newBook, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, autor, descricao, categoria, estoque } = newBook;
    if (!nome ||!autor ||!descricao ||!categoria ||!estoque) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.book.id) {
      updateBook(props.book.id, newBook);
    } else {
      createBook(newBook);
    }
  };

  const createBook = (book) => {
    const confirmCreate = window.confirm("Tem certeza que deseja criar este livro?");
    if (confirmCreate)
    {apiBiblioteca.get(`/books`)
      .then((response) => {
        const existingBook = response.data.find((existingBook) => {
          return (
            existingBook.nome === book.nome &&
            existingBook.autor === book.autor &&
            existingBook.categoria === book.categoria
          );
        });
  
        if (existingBook) {
          existingBook.estoque = (parseInt(existingBook.estoque) + parseInt(book.estoque)).toString();
          updateBook(existingBook.id, existingBook);
          

        } else {
          apiBiblioteca.post(`/books`, book)
            .then((response) => {
              setErrorMessage(null);
              setNewBook({
                nome: '',
                autor: '',
                descricao: '',
                categoria: '',
                estoque: '',
              });
              alert('Livro criado com sucesso!');
              window.location.reload();
            })
            .catch((error) => {
              setErrorMessage('Erro ao criar livro!');
              console.error(error);
            });
        }
      })
      .catch((error) => console.error(error));
  }
};

  const updateBook = (id, book) => {
    const confirmUpdate = window.confirm("Tem certeza que deseja atualizar este livro?");
    if (confirmUpdate) {
      apiBiblioteca.put(`/books/${id}`, book)
      .then((response) => {
        setErrorMessage(null);
        alert('Livro atualizado com sucesso!');
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar livro!');
        console.error(error);
      });
  }
};


  return (
    <>
      <h2 className="text-center mb-3">
        {props.book.id? "Editar Livro" : "Criar Novo Livro"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div class="alert alert-warning" role="alert">
              {errorMessage}
            </div>
          )}
          <br />
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="row mb-3">
              <div className="col-sm-8">
                <input
                  name="nome"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.nome}
                  placeholder="Título"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-8">
                <input
                  name="autor"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.autor}
                  placeholder="Autor"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-8">
                <input
                  name="descricao"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.descricao}
                  placeholder="Descrição"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-8">
                <select
                  className="form-select"
                  name="categoria"
                  defaultValue={props.book.categoria}
                  onChange={handleInputChange}
                >
                  <option value="Categoria">Categoria</option>
                  <option value="Autoajuda">Autoajuda</option>
                  <option value="Biografia e Autobiografia">Biografia e Autobiografia</option>
                  <option value="Clássicos">Clássicos</option>
                  <option value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</option>
                  <option value="Distopia">Distopia</option>
                  <option value="Ficção Científica">Ficção Científica</option>
                  <option value="Fantasia">Fantasia</option>
                  <option value="História">História</option>
                  <option value="Juvenil">Juvenil</option>
                  <option value="Poesia">Poesia</option>
                  <option value="Romance">Romance</option>
                  <option value="Suspense e Mistério">Suspense e Mistério</option>
                </select>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-sm-8">
                <input
                  name="estoque"
                  type="number"
                  className="form-control"
                  defaultValue={props.book.estoque}
                  placeholder="Estoque"
                  onChange={handleInputChange}
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
import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";

export function Librarians() {
  const [content, setContent] = useState(<LibrarianList showForm={showForm} />);

  function showList() {
    setContent(<LibrarianList showForm={showForm} />);
  }

  function showForm(Librarian) {
    setContent(<LibrarianForm Librarian={Librarian} showList={showList} />);
  }

  return (
    <div className="container my-5">
      {content}
    </div>
  );
}

function LibrarianList(props) {
  const [Librarians, setLibrarians] = useState([]);

  function fetchLibrarians() {
    apiBiblioteca.get(`/Librarians`)
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
        setLibrarians(data);
      })
    .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchLibrarians();
  }, []);
  
  function deleteLibrarian(id) {
    apiBiblioteca.delete(`/Librarians/${id}`)
     .then((response) => {
        if (!response.ok) {
          fetchLibrarians();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
     .catch((error) => console.error(error));
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Bibliotecarios</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Bibliotecario
      </button>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>DataNasc</th>
            <th>Senha</th>
            <th>Criado Em</th>
          </tr>
        </thead>
        <tbody>
          {
          Librarians.map((Librarian, index) => {
            return (
              <tr key={index}>
                <td>{Librarian.id}</td>
                <td>{Librarian.nome}</td>
                <td>{Librarian.cpf}</td>
                <td>{Librarian.email}</td>
                <td>{Librarian.telefone}</td>
                <td>{Librarian.dataNasc}</td>
                <td>{Librarian.criadoEm}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(Librarian)}
                    className="btn btn-primary btn-sm me-2"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteLibrarian(Librarian.id)}
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

function LibrarianForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newLibrarian, setNewLibrarian] = useState(props.Librarian? props.Librarian : {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNasc: '',
    senha: '',
    criadoEm: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLibrarian({...newLibrarian, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, cpf, email, telefone, dataNasc, senha, criadoEm } = newLibrarian;
    if (!nome || !cpf || !email || !telefone || !dataNasc || !senha || !criadoEm) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.librarian.id) {
      updateLibrarian(props.librarian.id, newLibrarian);
    } else {
      createLibrarian(newLibrarian);
    }
  };

  const createLibrarian = (librarian) => {
    apiBiblioteca.get(`/Librarians`)
     .then((response) => {
        const existingLibrarian = response.data.find((existingLibrarian) => {
          return (
            existingLibrarian.nome === librarian.nome &&
            existingLibrarian.cpf === librarian.cpf &&
            existingLibrarian.telefone === librarian.telefone
          );
        });
  
        if (existingLibrarian) {

          existingLibrarian.estoque = (parseInt(existingBook.estoque) + parseInt(book.estoque)).toString();
          updateLibrarian(existingLibrarian.id, existingLibrarian);
          alert('Bibliotecario já existente!');
        } else {

          apiBiblioteca.post(`/Librarians`, librarian)
           .then((response) => {
              setErrorMessage(null);
              setNewLibrarian({
                nome: '',
                cpf: '',
                email: '',
                telefone: '',
                dataNasc: '',
                senha: '',
                criadoEm: '',
              });
              alert('Bibliotecario criado com sucesso!');
            })
           .catch((error) => {
              setErrorMessage('Erro ao cadastrar bibliotecario!');
              console.error(error);
            });
        }
        
      })
     .catch((error) => console.error(error));
     props.showList(true);

      };

  const updateLibrarian = (id, librarian) => {
    apiBiblioteca.put(`/Librarians/${id}`, librarian)
     .then((response) => {
        setErrorMessage(null);
        alert('Bibliotecario atualizado com sucesso!');
      })
     .catch((error) => {
        setErrorMessage('Erro ao atualizar bibliotecario!');
        console.error(error);
      });
      
      props.showList(true);
  };


  return (
    <>
      <h2 className="text-center mb-3">
        {props.librarian.id? "Editar Bibliotecario" : "Criar Novo Bibliotecario"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div class="alert alert-warning" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={(event) => handleSubmit(event)}>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Nome</label>
              <div className="col-sm-8">
                <input
                  name="nome"
                  type="text"
                  className="form-control"
                  defaultValue={props.librarian.nome}
                  placeholder="Nome"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">CPF</label>
              <div className="col-sm-8">
                <input
                  name="cpf"
                  type="text"
                  className="form-control"
                  defaultValue={props.librarian.cpf}
                  placeholder="CPF"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Email</label>
              <div className="col-sm-8">
                <input
                  name="email"
                  type="text"
                  className="form-control"
                  defaultValue={props.librarian.email}
                  placeholder="Email"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Telefone</label>
              <div className="col-sm-8">
                <input
                  name="telefone"
                  type="text"
                  className="form-control"
                  defaultValue={props.librarian.telefone}
                  placeholder="Telefone"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Data Nascimento</label>
              <div className="col-sm-8">
                <input
                  name="dataNasc"
                  type="number"
                  className="form-control"
                  defaultValue={props.librarian.dataNasc}
                  placeholder="dataNasc"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Criado Em</label>
              <div className="col-sm-8">
                <input
                  name="criadoEm"
                  type="number"
                  className="form-control"
                  defaultValue={props.librarian.criadoEm}
                  placeholder="criadoEm"
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

export default Librarians;   
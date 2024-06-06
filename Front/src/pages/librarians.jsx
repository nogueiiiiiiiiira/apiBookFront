import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";

export function Librarians() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    showList(); 
  }, []);

  function showList() {
    setContent(<LibrarianList showForm={showForm} />);
  }

  function showForm(librarian) {
    setContent(<LibrarianForm librarian={librarian} showList={showList} />);
  }

  return (
    <div className="container my-5">
      {content}
    </div>
  );
}

function LibrarianList(props) {
  const [librarians, setLibrarians] = useState([]);

  useEffect(() => {
    fetchLibrarians();
  }, []);

  function fetchLibrarians() {
    apiBiblioteca.get(`/librarians`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        return response.data;
      })
      .then((data) => {
        setLibrarians(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteLibrarian(id) {
    apiBiblioteca.delete(`/librarians/${id}`)
     .then((response) => {
        if (response.status!== 204) { 
          throw new Error("Failed to delete librarian");
        }
        fetchLibrarians(); 
      })
     .catch((error) => console.error(error));
     window.location.reload();

  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Bibliotecários</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Bibliotecário
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
            <th>Data de Nascimento</th>
            <th>Criado Em</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
          librarians.map((librarian, index) => {
            return (
              <tr key={index}>
                <td>{librarian.id}</td>
                <td>{librarian.nome}</td>
                <td>{librarian.cpf}</td>
                <td>{librarian.email}</td>
                <td>{librarian.telefone}</td>
                <td>{librarian.dataNasc}</td>
                <td>{librarian.criadoEm}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(librarian)}
                    className="btn btn-primary btn-sm me-2"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteLibrarian(librarian.id)}
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
  const [newLibrarian, setNewLibrarian] = useState(props.librarian? props.librarian : {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNasc: '',
    senha: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'dataNasc') {
      const dateParts = value.split('-');
      const day = dateParts[2];
      const month = dateParts[1];
      const year = dateParts[0];
      const formattedDate = `${day}/${month}/${year}`;
      setNewLibrarian({ ...newLibrarian, [name]: formattedDate });
    } else {
      setNewLibrarian({ ...newLibrarian, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, cpf, email, telefone, dataNasc, senha } = newLibrarian;
    if (!nome ||!cpf ||!email ||!telefone ||!dataNasc || !senha) {
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
    apiBiblioteca.get(`/librarians`)
      .then((response) => {
        const librarians = response.data;
        const cpfExists = librarians.some((lib) => lib.cpf === librarian.cpf);
        const emailExists = librarians.some((lib) => lib.email === librarian.email);
        const telefoneExists = librarians.some((lib) => lib.telefone === librarian.telefone);
  
        if (cpfExists) {
          setErrorMessage('CPF já existe!');
        } else if (emailExists) {
          setErrorMessage('Email já existe!');
        } else if (telefoneExists) {
          setErrorMessage('Telefone já existe!');
        } else {
          apiBiblioteca.post(`/librarians`, librarian)
            .then((response) => {
              setErrorMessage(null);
              setNewLibrarian({
                nome: '',
                cpf: '',
                email: '',
                telefone: '',
                dataNasc: '',
                senha: '',
              });
              alert('Bibliotecário criado com sucesso!');
              window.location.reload();
            })
            .catch((error) => {
              if (error.response.status === 400) {
                setErrorMessage('Erro ao criar bibliotecário: dados inválidos');
              } else {
                setErrorMessage('Erro ao criar bibliotecário!');
              }
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateLibrarian = (id, librarian) => {
    apiBiblioteca.put(`/librarians/${id}`, librarian)
      .then((response) => {
        setErrorMessage(null);
        alert('Bibliotecário atualizado com sucesso!');
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar bibliotecário!');
        console.error(error);
      });
  
    window.location.reload();
  };


  return (
    <>
      <h2 className="text-center mb-3">
        {props.librarian.id? "Editar Bibliotecário" : "Criar Novo Bibliotecário"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div className="alert alert-warning" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={(event) => handleSubmit(event)}>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Nome</label>
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
              <label className="col-sm-4 col-form-label">CPF</label>
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
              <label className="col-sm-4 col-form-label">Email</label>
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
              <label className="col-sm-4 col-form-label">Telefone</label>
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
              <label className="col-sm-4 col-form-label">Data de Nascimento</label>
              <div className="col-sm-8">
                <input
                  name="dataNasc"
                  type="date"
                  className="form-control"
                  defaultValue={props.librarian.dataNasc}
                  placeholder="Data de Nascimento"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Senha</label>
              <div className="col-sm-8">
                <input
                  name="senha"
                  type="password"
                  className="form-control"
                  defaultValue={props.librarian.senha}
                  placeholder="Senha"
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

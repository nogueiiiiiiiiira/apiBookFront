import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";
import loans from "./loans";

export function Readers() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    showList(); 
  }, []);

  function showList() {
    setContent(<ReaderList showForm={showForm} />);
  }

  function showForm(reader) {
    setContent(<ReaderForm reader={reader} showList={showList} />);
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

function ReaderList(props) {
  const [readers, setReaders] = useState([]);

  useEffect(() => {
    fetchReaders();
  }, []);

  function fetchReaders() {
    apiBiblioteca.get(`/readers`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        return response.data;
      })
      .then((data) => {
        setReaders(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteReader(id) {
    apiBiblioteca.delete(`/readers/${id}`)
     .then((response) => {
        if (response.status!== 204) { 
          throw new Error("Failed to delete reader");
        }
        fetchReaders(); 
      })
     .catch((error) => console.error(error));
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Leitores</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Leitor
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
            readers.map((reader, index) => {
              return (
                <tr key={index}>
                  <td>{reader.id}</td>
                  <td>{reader.nome}</td>
                  <td>{reader.cpf}</td>
                  <td>{reader.email}</td>
                  <td>{reader.telefone}</td>
                  <td>{reader.dataNasc}</td>
                  <td>{reader.criadoEm}</td>
                  <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => props.showForm(reader)}
                      className="btn btn-primary btn-sm me-2"
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteReader(reader.id)}
                      className="btn btn-danger btn-sm"
                      type="button"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </>
  );
}

function ReaderForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newReader, setNewReader] = useState(props.reader? props.reader : {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNasc: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'dataNasc') {
      const dateParts = value.split('-');
      const day = dateParts[2];
      const month = dateParts[1];
      const year = dateParts[0];
      const formattedDate = `${day}/${month}/${year}`;
      setNewReader({ ...newReader, [name]: formattedDate });
    } else {
      setNewReader({ ...newReader, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, cpf, email, telefone, dataNasc} = newReader;
    if (!nome || !cpf || !email || !telefone || !dataNasc) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    if (props.reader.id) {
      updateReader(props.reader.id, newReader);
    } else {
      createReader(newReader);
    }
  };

  const createReader = (reader) => {
    apiBiblioteca.get(`/librarians`)
      .then((response) => {
        const librarians = response.data;
        const cpfExists = librarians.some((lib) => lib.cpf === reader.cpf);
        const emailExists = librarians.some((lib) => lib.email === reader.email);
        const telefoneExists = librarians.some((lib) => lib.telefone === reader.telefone);
  
        apiBiblioteca.get(`/readers`)
          .then((response) => {
            const readers = response.data;
            const cpfExistsInReaders = readers.some((reader) => reader.cpf === reader.cpf);
            const emailExistsInReaders = readers.some((reader) => reader.email === reader.email);
            const telefoneExistsInReaders = readers.some((reader) => reader.telefone === reader.telefone);
  
            if (cpfExists || cpfExistsInReaders) {
              setErrorMessage('CPF já existe!');
            } else if (emailExists || emailExistsInReaders) {
              setErrorMessage('Email já existe!');
            } else if (telefoneExists || telefoneExistsInReaders) {
              setErrorMessage('Telefone já existe!');
            } else {
              apiBiblioteca.post(`/readers`, reader)
                .then((response) => {
                  setErrorMessage(null);
                  setNewReader({
                    nome: '',
                    cpf: '',
                    email: '',
                    telefone: '',
                    dataNasc: '',
                  });
                  alert('Leitor criado com sucesso!');
                  props.showList(); 
                })
                .catch((error) => {
                  if (error.response.status === 400) {
                    setErrorMessage('Erro ao criar leitor: dados inválidos');
                  } else {
                    setErrorMessage('Erro ao criar leitor!');
                  }
                  console.error(error);
                });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateReader = (id, reader) => {
    apiBiblioteca.put(`/readers/${id}`, reader)
      .then((response) => {
        setErrorMessage(null);
        alert('Leitor atualizado com sucesso!');
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar leitor!');
        console.error(error);
      });
  };


  return (
    <>
      <h2 className="text-center mb-3">
        {props.reader.id? "Editar Leitor" : "Criar Novo Leitor"}
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
                  defaultValue={props.reader.nome}
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
                  defaultValue={props.reader.cpf}
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
                  defaultValue={props.reader.email}
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
                  defaultValue={props.reader.telefone}
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
                  defaultValue={props.reader.dataNasc}
                  placeholder="Data de Nascimento"
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

export default Readers;

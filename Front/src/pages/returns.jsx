import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Rets() {
  const [content, setContent] = useState(<RetList showForm={showForm} />);

  function showList() {
    setContent(<RetList showForm={showForm} />);
  }

  function showForm(ret) {
    setContent(<RetForm ret={ret} showList={showList} />);
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

function RetList(props) {
  const [rets, setRets] = useState([]);

  function fetchRets() {
    apiBiblioteca.get(`/returns`)
    .then((response) => {
        if (!response) {
          throw new Error('No response from server');
        }
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
        setRets(data);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchRets();
  }, []);

  function deleteRet(id) {
    apiBiblioteca.delete(`/returns/${id}`)
      .then((response) => {
        if (!response.ok) {
          fetchRets();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
      .catch((error) => console.error(error));
      window.location.reload();
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Devoluções</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Devolução
      </button>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CPF do Leitor</th>
            <th>ID do Livro</th>
            <th>Previsão da Devolução</th>
            <th>Data da Devolução</th>
            <th>Multa Atribuída (?) </th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
            rets.map((ret, index) => {
              return (
                <tr key={index}>
                  <td>{ret.id}</td>
                  <td>{ret.cpf}</td>
                  <td>{ret.idLivro}</td>
                  <td>{ret.prevDev}</td>
                  <td>{ret.dataAtual}</td>
                  <td>{ret.multaAtribuida}</td>
                  <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => props.showForm(ret)}
                      className="btn btn-primary btn-sm me-2"
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteRet(ret.id)}
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

function RetForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newRet, setNewRet] = useState(props.ret ? props.ret : {
    cpf: '',
    idLivro: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRet({ ...newRet, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const { cpf, idLivro } = newRet;
    if (!cpf || !idLivro) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.ret && props.ret.id) {
      updateRet(props.ret.id, newRet);
    } else {
      createRet(newRet);
    }
  };

  const createRet = (ret) => {
    apiBiblioteca.get(`/readers`)
      .then((response) => {
        const readers = response.data;
        const cpfExistsInReaders = readers.some((existingReader) => existingReader.cpf === ret.cpf);
  
        if (!cpfExistsInReaders) {
          setErrorMessage('CPF não foi encontrado no banco de leitores!');
          return;
        }
  
        apiBiblioteca.get(`/books`)
          .then((response) => {
            const books = response.data;
            const idExistsInBooks = books.some((existingBook) => existingBook.idLivro === books.idLivro);
  
            if (!idExistsInBooks) {
              setErrorMessage('Livro não foi encontrado no banco de dados!');
              return;
            }
  
            apiBiblioteca.post(`/returns`, ret)
              .then((response) => {
                setErrorMessage(null);
                setNewRet({
                  cpf: "",
                  idLivro: "",
                });
                alert('Devolução realizada com sucesso!');
                window.location.reload();
              })
              .catch((error) => {
                if (error && error.response && error.response.status === 400) {
                  setErrorMessage('Livro não foi encontrado no banco de dados!');
                } else {
                  setErrorMessage('Erro ao criar empréstimo!');
                }
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

  };

  const updateRet = (id, ret) => {
    apiBiblioteca.put(`/returns/${id}`, ret)
      .then((response) => {
        setErrorMessage(null);
        alert('Devolução atualizada com sucesso!');
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar devolução!');
        console.error(error);
      });
    window.location.reload();
  };

  return (
    <>
      <h2 className="text-center mb-3">
        {props.ret.id ? "Editar Devolução" : "Criar Novo Devolução"}
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
              <label className="col-sm4 col-form-label">CPF do Leitor</label>
              <div className="col-sm-8">
                <input
                  name="cpf"
                  type="text"
                  className="form-control"
                  defaultValue={props.ret.cpf}
                  placeholder="CPF do Leitor"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">ID do Livro</label>
              <div className="col-sm-8">
                <input
                  name="idLivro"
                  type="number"
                  className="form-control"
                  defaultValue={props.ret.idLivro}
                  placeholder="ID do Livro"
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

export default Rets;
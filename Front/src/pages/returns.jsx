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

  useEffect(() => {
    fetchRets();
  }, []);

  function fetchRets() {
    apiBiblioteca.get(`/returns`)
      .then((response) => {
        if (!response || response.status !== 200) {
          throw new Error('Unexpected Server Response');
        }
        setRets(response.data);
      })
      .catch((error) => console.error(error));
  }

  function deleteRet(id) {
    apiBiblioteca.delete(`/returns/${id}`)
      .then((response) => {
        if (response.status === 200) {
          fetchRets();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
      .catch((error) => console.error(error));
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
            <th>Multa</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {rets.map((ret) => (
            <tr key={ret.id}>
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
          ))}
        </tbody>
      </table>
    </>
  );
}

function RetForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newRet, setNewRet] = useState({
    cpf: '',
    idLivro: '',
  });

  useEffect(() => {
    if (props.ret) {
      setNewRet({ ...props.ret });
    }
  }, [props.ret]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRet({ ...newRet, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const { cpf, idLivro } = newRet;
    if (!cpf || !idLivro) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
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
          setErrorMessage('CPF não encontrado na base de leitores!');
          return;
        }
  
        apiBiblioteca.get(`/books`)
          .then((response) => {
            const books = response.data;
            const idExistsInBooks = books.some((existingBook) => existingBook.idLivro === ret.idLivro);
  
            if (!idExistsInBooks) {
              setErrorMessage('ID do Livro não encontrado na base de dados!');
              return;
            }
  
            apiBiblioteca.post(`/returns`, ret)
              .then((response) => {
                setErrorMessage(null);
                setNewRet({
                  cpf: "",
                  idLivro: "",
                });
                alert('Devolução criada com sucesso!');
                props.showList();
              })
              .catch((error) => {
                setErrorMessage('Erro ao criar devolução!');
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
        props.showList();
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar devolução!');
        console.error(error);
      });
  };

  return (
    <>
      <h2 className="text-center mb-3">
        {props.ret && props.ret.id ? "Editar Devolução" : "Criar Nova Devolução"}
      </h2>
      {errorMessage && (
        <div className="alert alert-warning" role="alert">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">CPF do Leitor</label>
          <input
            name="cpf"
            type="text"
            className="form-control"
            value={newRet.cpf}
            placeholder="CPF do Leitor"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ID do Livro</label>
          <input
            name="idLivro"
            type="number"
            className="form-control"
            value={newRet.idLivro}
            placeholder="ID do Livro"
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary me-3" type="submit">
          Salvar
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={props.showList}
        >
          Cancelar
        </button>
      </form>
    </>
  );
}

export default Rets;

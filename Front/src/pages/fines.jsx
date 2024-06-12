import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Fines() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    showList(); 
  }, []);

  function showList() {
    setContent(<FineList showForm={showForm} />);
  }

  function showForm(fine) {
    setContent(<FineForm fine={fine} showList={showList} />);
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

function FineList(props) {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    fetchFines();
  }, []);

  function fetchFines() {
    apiBiblioteca.get(`/fines`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        return response.data;
      })
      .then((data) => {
        setFines(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteFine(id) {
    apiBiblioteca.delete(`/fines/${id}`)
     .then((response) => {
        if (!response.ok) {
          fetchFines();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
     .catch((error) => console.error(error));
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Multas</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        Pagar Multa
      </button>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CPF do Leitor</th>
            <th>ID do Livro</th>
            <th>Dias Atrasados</th>
            <th>Total R$</th>
            <th>Status da Multa</th>
            <th>Criado Em</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>         
          {
            fines.map((fine, index) => {
              return (
                <tr key={index}>
                  <td>{fine.id}</td>
                  <td>{fine.cpf}</td>
                  <td>{fine.idLivro}</td>
                  <td>{fine.diasAtra}</td>
                  <td>{fine.total}</td>
                  <td>{fine.statusPag}</td>
                  <td>{fine.criadoEm}</td>
                  <td>
                    <button onClick={() => deleteFine(fine.id)} className="btn btn-danger" type="button">
                      Excluir
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

function FineForm(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [cpf, setCpf] = useState(props.fine.cpf || ''); 
    const [idLivro, setIdLivro] = useState(props.fine.idLivro || '');

  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === "cpf") {
      setCpf(value);
    } else if (name === "idLivro") {
      setIdLivro(value);
    }
  }

  const handlePayFine = async (event) => {
    event.preventDefault();
    try {
      const response = await apiBiblioteca.put('/payFine', {
        cpf: cpf,
        idLivro: idLivro,
      });
      if (response.status === 201) {
        props.showList();
      } else {
        setErrorMessage('Erro ao pagar multa');
      }
    } catch (error) {
      setErrorMessage('Erro ao pagar multa');
    }
  };

  return (
    <>
    <h2 className="text-center mb-3">
        {props.fine.id? "Editar Multa" : "Pagar Multa"}
      </h2>
    <div className="row">
      <div className="col-lg-6 mx-auto">
        {errorMessage && (
          <div className="alert alert-warning" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handlePayFine}>

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">CPF do Leitor</label>
            <div className="col-sm-8">
              <input
                name="cpf"
                type="text"
                className="form-control"
                value={cpf}
                placeholder="CPF do Leitor"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">ID do Livro</label>
            <div className="col-sm-8">
              <input
                name="idLivro"
                type="text"
                className="form-control"
                value={idLivro}
                placeholder="ID do Livro"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="offset-sm-4 col-sm-4 d-grid">
              <button className="btn btn-primary btn-sm me-3" type="submit">
                Pay
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

export default Fines;
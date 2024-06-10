import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Loans() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    showList(); 
  }, []);

  function showList() {
    setContent(<LoanList showForm={showForm} />);
  }

  function showForm(loan) {
    setContent(<LoanForm librarian={loan} showList={showList} />);
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

function LoanList(props) {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  function fetchLoans() {
    apiBiblioteca.get(`/loans`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        return response.data;
      })
      .then((data) => {
        setLoans(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteLoan(id) {
    apiBiblioteca.delete(`/loans/${id}`)
     .then((response) => {
        if (response.status!== 204) { 
          throw new Error("Não foi possível excluir o empréstimo");
        }
        fetchLibrarians(); 
      })
     .catch((error) => console.error(error));
     window.location.reload();

  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Empréstimos</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Emprestar
      </button>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CPF do Leitor</th>
            <th>ID do Livro</th>
            <th>Data do Empréstimo</th>
            <th>Previsão da Devolução</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
          loans.map((loan, index) => {
            return (
              <tr key={index}>
                <td>{loan.id}</td>
                <td>{loan.cpf}</td>
                <td>{loan.idLivro}</td>
                <td>{loan.dataEmp}</td>
                <td>{loan.dataDev}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(loan)}
                    className="btn btn-primary btn-sm me-2"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteLoan(loan.id)}
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

function LoanForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newLoan, setNewLoan] = useState(props.loan? props.loan : {
    cpf: '',
    idLivro: '',
    dataEmp: '',
    dataDev: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'dataNasc') {
      const dateParts = value.split('-');
      const day = dateParts[2];
      const month = dateParts[1];
      const year = dateParts[0];
      const formattedDate = `${day}/${month}/${year}`;
      setNewLoan({ ...newLoan, [name]: formattedDate });
    } else {
        setNewLoan({ ...newLoan, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { cpf, idLivro, dataEmp, dataDev } = newLoan;
    if ( !cpf || !idLivro || !dataEmp || !dataDev) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    if (props.loan.id) {
      updateLibrarian(props.loan.id, newLoan);
    } else {
      createLoan(newLoan);
    }
  };

  const createLoan = (loan) => {
    apiBiblioteca.get(`/loans`)
      .then((response) => {
        const loans = response.data;
        const cpfExists = loans.some((lib) => lib.cpf === loan.cpf);
        const idLivroExists = loans.some((lib) => lib.idLivro === loan.idLivro);
  
        apiBiblioteca.get(`/readers`)
          .then((response) => {
            const readers = response.data;
            const cpfExistsInReaders = readers.some((reader) => reader.cpf === librarian.cpf);
  
            if (cpfExists || cpfExistsInReaders) {
              setErrorMessage('CPF já existe!');
            } else if (idLivroExists || emailExistsInReaders) {
              setErrorMessage('Email já existe!');
            } else {
              apiBiblioteca.post(`/loans`, loan)
                .then((response) => {
                  setErrorMessage(null);
                  setNewLoan({
                    cpf: '',
                    idLivro: '',
                    dataEmp: '',
                    dataDev: '',
                  });
                  alert('Empréstimo criado com sucesso!');
                  window.location.reload();
                })
                .catch((error) => {
                  if (error.response.status === 400) {
                    setErrorMessage('Erro ao criar empréstimo: dados inválidos');
                  } else {
                    setErrorMessage('Erro ao criar empréstimo!');
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

  const updateLoan = (id, loans) => {
    apiBiblioteca.put(`/loans/${id}`, loans)
      .then((response) => {
        setErrorMessage(null);
        alert('Empréstimo atualizado com sucesso!');
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar empréstimo!');
        console.error(error);
      });
  
    window.location.reload();
  };


  return (
    <>
      <h2 className="text-center mb-3">
        {props.loan.id? "Editar empréstimo" : "Criar Novo empréstimo"}
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
              <label className="col-sm-4 col-form-label">CPF</label>
              <div className="col-sm-8">
                <input
                  name="cpf"
                  type="text"
                  className="form-control"
                  defaultValue={props.loan.cpf}
                  placeholder="CPF"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">idLivro</label>
              <div className="col-sm-8">
                <input
                  name="idLivro"
                  type="text"
                  className="form-control"
                  defaultValue={props.loan.idLivro}
                  placeholder="id Livro"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">dataEmp</label>
              <div className="col-sm-8">
                <input
                  name="dataEmp"
                  type="text"
                  className="form-control"
                  defaultValue={props.loan.dataEmp}
                  placeholder="Data Empréstimo"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">dataDev</label>
              <div className="col-sm-8">
                <input
                  name="dataDev"
                  type="text"
                  className="form-control"
                  defaultValue={props.loan.dataDev}
                  placeholder="Data Devolução"
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

export default Loans;
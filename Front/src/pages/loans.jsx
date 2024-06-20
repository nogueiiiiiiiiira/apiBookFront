import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";
import InputMask from 'react-input-mask';

export function Loans() {
  const [content, setContent] = useState(<LoanList showForm={showForm} />);

  function showList() {
    setContent(<LoanList showForm={showForm} />);
  }

  function showForm(loan) {
    setContent(<LoanForm loan={loan} showList={showList} />);
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

  function fetchLoans() {
    apiBiblioteca.get(`/loans`)
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
        setLoans(data);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchLoans();
  }, []);

  function deleteLoan(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este empréstimo?");
    if (confirmDelete) 
    {
      apiBiblioteca.delete(`/loans/${id}`)
      .then((response) => {
        if (!response.ok) {
          fetchLoans();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
      .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Empréstimos</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Empréstimo
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
  const [newLoan, setNewLoan] = useState(props.loan ? props.loan : {
    cpf: '',
    idLivro: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLoan({ ...newLoan, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const { cpf, idLivro } = newLoan;
    if (!cpf || !idLivro) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.loan && props.loan.id) {
      updateLoan(props.loan.id, newLoan);
    } else {
      createLoan(newLoan);
    }
  };

  const createLoan = (loan) => {
    const confirmCreate = window.confirm("Tem certeza que deseja realizar este empréstimo?");
    if (confirmCreate) {
    apiBiblioteca.get(`/readers`)
      .then((response) => {
        const readers = response.data;
        const cpfExistsInReaders = readers.some((existingReader) => existingReader.cpf === loan.cpf);
  
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
  
            apiBiblioteca.post(`/loans`, loan)
              .then((response) => {
                setErrorMessage(null);
                setNewLoan({
                  cpf: "",
                  idLivro: "",
                });
                alert('Empréstimo realizado com sucesso!');
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
    }
  };

  return (
    <>
      <h2 className="text-center mb-3">
        {props.loan.id ? "Editar Empréstimo" : "Criar Novo Empréstimo"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div className="alert alert-warning" role="alert">
              {errorMessage}
            </div>
          )}
          <br />
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="row mb-3">
              <div className="col-sm-8">
                <InputMask
                  name="cpf"
                  type="text"
                  className="form-control"
                  defaultValue={props.loan.cpf}
                  placeholder="CPF"
                  onChange={handleInputChange}
                  mask="999.999.999-99"
                  maskChar="_"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-8">
                <input
                  name="idLivro"
                  type="number"
                  className="form-control"
                  defaultValue={props.loan.idLivro}
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

export default Loans;
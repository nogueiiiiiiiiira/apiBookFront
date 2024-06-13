import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Rets() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    showList(); 
  }, []);

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
        if (response.status!== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        return response.data;
      })
     .then((data) => {
        setRets(data);
      })
     .catch((error) => console.error(error));
  }

  function deleteRet(id) {
    apiBiblioteca.delete(`/returns/${id}`)
    .then((response) => {
        if (response.status!== 204) { 
          throw new Error("Failed to delete return");
        }
        fetchRets(); 
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
            <th>Previsão de Entrega</th>
            <th>Data de Entrega</th>
            <th>Multa</th>
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
  const [newRet, setNewRet] = useState(props.ret? props.ret : {
    cpf: '',
    idLivro: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'dataNasc') {
      const dateParts = value.split('-');
      const day = dateParts[2];
      const month = dateParts[1];
      const year = dateParts[0];
      const formattedDate = `${day}/${month}/${year}`;
      setNewRet({...newRet, [name]: formattedDate });
    } else {
      setNewRet({...newRet, [name]: value });
    }
  };

  const validateRet = (newRet) => {
    const { cpf, idLivro } = newRet;
  
    return apiBiblioteca.get(`/loans?cpf=${cpf}&idLivro=${idLivro}`)
     .then((response) => {
        if (response.status!== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        const loans = response.data;
  
        if (loans.length === 0) {
          throw new Error('CPF ou ID do livro não encontrados');
        }
      })
     .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { cpf, idLivro } = newRet;
    if (!cpf || !idLivro) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
        return;
      }

      if(props.ret.id){
        updateRet(props.ret.id, newRet);
      } else {
        createRet(props.ret.id, newRet);
      }
    };
  
    const createRet = (ret) => {
      apiBiblioteca.post(`/returns`, ret)
        .then((response) => {
          setErrorMessage(null);
          setNewRet({
            cpf: '',
            idLivro: '',
          });
          alert('Devolução realizada com sucesso!');
          window.location.reload();
        })
        .catch((error) => {
          if (error.response.status === 400) {
            setErrorMessage('Erro ao criar devolução: dados inválidos');
          } else {
            setErrorMessage('Erro ao realizar a devolução!');
          }
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
          setErrorMessage('Erro ao atualizar a devolução!');
          console.error(error);
        });
  
      window.location.reload();
    };
  
    useEffect(() => {
      validateRet(newRet);
    }, [newRet, validateRet]);
  
    return (
      <>
        <h2 className="text-center mb-3">
          {props.ret ? "Editar Devolução" : "Criar Nova Devolução"}
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
                <label className="col-sm-4 col-form-label">CPF do Leitor</label>
                <div className="col-sm-8">
                  <input
                    name="cpf"
                    type="text"
                    className="form-control"
                    defaultValue={props.ret?.cpf}
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
                    defaultValue={props.ret?.idLivro}
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
                    Cancelar
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
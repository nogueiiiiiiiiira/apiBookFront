import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";
import InputMask from 'react-input-mask';

export function PrimeiroAcesso() {
  const [content, setContent] = useState(<CadastroForm />);

  return (
    <>
      <Menu />
      <div className="container my-5">
        {content}
      </div>
    </>
  );
}

function CadastroForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [newLibrarian, setNewLibrarian] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNasc: "",
    senha: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === "dataNasc"? formatDataNasc(value) : value;
    setNewLibrarian({...newLibrarian, [name]: formattedValue });
  };

  const formatDataNasc = (date) => {
    if (date) {
      const [year, month, day] = date.split("-");
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    } else {
      return date;
    }
  };

  const createLibrarian = (librarian) => {
    apiBiblioteca.post(`/librarians`, librarian)
     .then((response) => {
        setErrorMessage(null);
        alert("Bibliotecário criado com sucesso!");
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, cpf, email, telefone, dataNasc, senha } = newLibrarian;
    if (!nome ||!cpf ||!email ||!telefone ||!dataNasc ||!senha) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    createLibrarian(newLibrarian);
  };

  return (
    <>
      <h2 className="text-center mb-3">Cadastre-se</h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div className="alert alert-warning" role="alert">
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
                  placeholder="Nome"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">CPF</label>
              <div className="col-sm-8">
              <InputMask
                name="cpf"
                type="text"
                className="form-control"
                placeholder="CPF"
                onChange={handleInputChange}
                mask="999.999.999-99"
                maskChar="_"
              />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Email</label>
              <div className="col-sm-8">
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Telefone</label>
              <div className="col-sm-8">
                <InputMask
                  name="telefone"
                  type="text"
                  className="form-control"
                  placeholder="Telefone"
                  onChange={handleInputChange}
                  mask="(99) 99999-9999"
                  maskChar="_"
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Data de Nascimento</label>
              <div className="col-sm-8">
                <input
                  name="dataNasc"
                  type="date"
                  className="form-control"
                  placeholder="Data de Nascimento"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Senha</label>
              <div className="col-sm-8">
                <input
                  name="senha"
                  type="password"
                  className="form-control"
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PrimeiroAcesso;
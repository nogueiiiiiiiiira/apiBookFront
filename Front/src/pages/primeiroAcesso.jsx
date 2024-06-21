import React, { useState } from "react";
import { apiBiblioteca } from "../api/server";
import InputMask from 'react-input-mask';
import { useNavigate } from "react-router-dom";
import styles from './primeiroAcesso.module.css';

export function PrimeiroAcesso() {
  const [content] = useState(<CadastroForm />);

  return (
      <div>
        {content}
      </div>
  );
}

function CadastroForm() {
  const navigate = useNavigate();
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
    const confirmCreate = window.confirm("Tem certeza que deseja criar este bibliotecário?");
    if (confirmCreate) {
      apiBiblioteca.get(`/librarians`)
        .then((response) => {
          const librarians = response.data;
          const cpfExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.cpf === librarian.cpf);
          const emailExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.email === librarian.email);
          const telefoneExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.telefone === librarian.telefone);
    
          if(cpfExistsInLibrarians){
            setErrorMessage(null);
            alert('CPF já existe!');
          }  else if (emailExistsInLibrarians) {
            setErrorMessage(null);
            alert('Email já existe!');
          } else if (telefoneExistsInLibrarians) {
            setErrorMessage(null)
            alert('Telefone já existe!');
          } else {
            apiBiblioteca.post(`/librarians`, librarian)
              .then((response) => {
                setErrorMessage(null);
                setNewLibrarian({
                  nome: "",
                  cpf: "",
                  email: "",
                  telefone: "",
                  dataNasc: "",
                  senha: "",
                });
                alert("Bibliotecário criado com sucesso!");
                navigate("/Login");
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
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, cpf, email, telefone, dataNasc, senha } = newLibrarian;
    if (!nome || !cpf || !email || !telefone || !dataNasc || !senha) {
      setErrorMessage(null);
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    createLibrarian(newLibrarian);
  };

  return (
    <div className={`container-fluid d-flex align-items-center vh-100 ${styles.login_container}`}>
       <div className={`card p-5 shadow`}>
          <form onSubmit={(event) => handleSubmit(event)}>
            <h1>Cadastre-se</h1>
            <br />
              {errorMessage && (
                <div role="alert">
                  {errorMessage}
                </div>
              )}

          <input
            name="nome"
            type="text"
            placeholder="Nome"
            onChange={handleInputChange}
            className="form-control mb-3"
            />

          <InputMask
            name="cpf"
            type="text"

            placeholder="CPF"
            onChange={handleInputChange}
            mask="999.999.999-99"
            maskChar="_"
            className="form-control mb-3"
          />

          <input
            name="email"
            type="text"

            placeholder="Email"
            onChange={handleInputChange}
            className="form-control mb-3"
          />

          <InputMask
            name="telefone"
            type="text"

            placeholder="Telefone"
            onChange={handleInputChange}
            mask="(99) 99999-9999"
            maskChar="_"
            className="form-control mb-3"
          />

          <input
            name="dataNasc"
            type="date"
    
            placeholder="Data de Nascimento"
            onChange={handleInputChange}
            className="form-control mb-3"
          />

          <input
            name="senha"
            type="password"

            placeholder="Senha"
            onChange={handleInputChange}
            className="form-control mb-3"
          />

          <button type="submit" className="btn btn-primary w-100">
            Salvar
          </button>
        </form>
        <p className="text-center mt-3">Voltar para <a className="text-primary" href="/Login">Login</a></p>
      </div>
    </div>
  );  
}

export default PrimeiroAcesso;
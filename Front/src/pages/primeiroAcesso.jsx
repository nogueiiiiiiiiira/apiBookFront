import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import InputMask from 'react-input-mask';
import style from "./style.module.css";

export function PrimeiroAcesso() {
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
      apiBiblioteca.get(`/librarians`)
        .then((response) => {
          const librarians = response.data;
          const cpfExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.cpf === librarian.cpf);
          const emailExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.email === librarian.email);
          const telefoneExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.telefone === librarian.telefone);
    
          if(cpfExistsInLibrarians){
            setErrorMessage('CPF já existe! Tente outro!');
          }  else if (emailExistsInLibrarians) {
            setErrorMessage('Email já existe!  Tente outro!');
          } else if (telefoneExistsInLibrarians) {
            setErrorMessage('Telefone já existe!  Tente outro!');
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
                window.location.reload();
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  setErrorMessage('CPF já existe! Tente outro!');
                } else {
                  setErrorMessage('Erro ao criar bibliotecário!');
                }
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
        })
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
      <div className={style.firstAcess_container}>
        <div className={style.firstAcess_form_container}>
          <div className={style.firstAcessleft}>
            <form className={style.form_container} onSubmit={handleSubmit}>
              <h1>Cadastre-se</h1>
              {errorMessage && (
                <div className={style.error_message}>{errorMessage}</div>
              )}
              <input
                name="nome"
                type="text"
                className={style.input}
                placeholder="Nome"
                onChange={handleInputChange}
              />
              
              <InputMask
                name="cpf"
                type="text"
                className={style.input}
                placeholder="CPF"
                onChange={handleInputChange}
                mask="999.999.999-99"
                maskChar="_"
              />
  
              <input
                name="email"
                type="email"
                className={style.input}
                placeholder="Email"
                onChange={handleInputChange}
              />
  
              <InputMask
                name="telefone"
                type="text"
                className={style.input}
                placeholder="Telefone"
                onChange={handleInputChange}
                mask="(99) 99999-9999"
                maskChar="_"
              />
  
              <input
                name="dataNasc"
                type="text"
                className={style.input}
                placeholder="Data de Nascimento"
                onFocus={(e) => {
                  e.target.type = 'date';
                  e.target.placeholder = '';
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                    e.target.placeholder = 'Data de Nascimento';
                  }
                }}
                onChange={handleInputChange}
              />
  
              <input
                name="senha"
                type="password"
                className={style.input}
                placeholder="Senha"
                onChange={handleInputChange}
              />
              <br />
              <button type="submit" className={style.green_btn}>
                Cadastrar
              </button>
            </form>
            <p><a className={style.firstAcess} href="/login">Já tem uma conta? Faça login!</a></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrimeiroAcesso;
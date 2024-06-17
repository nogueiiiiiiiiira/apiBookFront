import React, { useState } from "react";
import { Link } from "react-router-dom";

function Menu2({ onSearch }) { 
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid justify-content-center">
        <Link className="navbar-brand" to="/">
          Biblioteca Nova
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/librarians">
                Bibliotecários
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/books">
                Livros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/readers">
                Leitores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/loans">
                Empréstimos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/returns">
                Devoluções
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fines">
                Multas
              </Link>
            </li>
          </ul>
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Pesquisar livro"
              aria-label="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              Pesquisar
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Menu2;

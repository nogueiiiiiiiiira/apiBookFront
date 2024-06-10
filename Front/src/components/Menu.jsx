import React from "react";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/librarians">
                Bibliotecarios
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
        </div>
      </div>
    </nav>
  );
}

export default Menu;

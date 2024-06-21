import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './login.module.css';

const Login = () => {
  const [data, setData] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  const handleChange = ({ currentTarget: input }) => {
    setData({...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3001/login";
      const { data: res } = await axios.post(url, data);
      setToken(res.token);
      localStorage.setItem("token", res.token);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={`container-fluid d-flex align-items-center vh-100 ${styles.login_container}`}>
      <div className={`card p-5 shadow`}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <h1 className="text-center">Login</h1>
          <br />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={data.email}
            required
            className="form-control mb-3"
          />
          <input
            type="password"
            placeholder="Senha"
            name="senha"
            onChange={handleChange}
            value={data.senha}
            required
            className="form-control mb-3"
          />
          <div className="d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input type="checkbox" id="remember-me" className="form-check-input"/>
              <label htmlFor="remember-me" className="form-check-label">Lembre-me</label>
            </div>
          </div>
          <br />
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">Não tem conta? <a className="text-primary" href="/PrimeiroAcesso">Clique aqui</a></p>
        <p className="text-center mt-3"><a className="text-primary" href="#">Esqueceu a senha?</a></p>
      </div>
    </div>
  );
};

export default Login;
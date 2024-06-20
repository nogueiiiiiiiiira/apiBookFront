import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import style from "./style.module.css";

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
        console.log(error);
        window.alert(`Erro ao logar: login ou senha incorretos!`);
        window.location.reload();
      }
    }
  };

  return (
    <div className={style.login_container}>
      <div className={style.login_form_container}>
        <div className={style.left}>
          <form className={style.form_container} onSubmit={handleSubmit}>
            <h1>Login</h1>
            <br />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={style.input}
            />
            <input
              type="password"
              placeholder="Senha"
              name="senha"
              onChange={handleChange}
              value={data.senha}
              required
              className={style.input}
            />
            <div className={style.check}>
              <br />
              <input type="checkbox" id="remember-me" />
              <label htmlFor="rememberMe">Lembre-me</label>
              <a href="#" className={style.forgotPassword}>
                Esqueceu a senha?
              </a>
            </div>
            <br />
            <br />
            <br />
            {error && (
              <div className={style.error_msg}>{error}</div>
            )}
            <button type="submit" className={style.green_btn}>
              Login
            </button>
          </form>
        </div>
        <p>
          <a className={style.firstAcess} href="/PrimeiroAcesso">
            Não tem uma conta? Cadastre-se!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
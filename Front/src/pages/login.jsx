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
      }
    }
  };

  return (
    <div className={style.login_container}>
      <div className={style.login_form_container}>
        <div className={style.left}>
          <form className={style.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
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
            {error && <div className={style.error_msg}>{error}</div>}
            <button type="submit" className={style.green_btn}>
              Sing In
            </button>
          </form>
        </div>
        <div className={style.right}>
          <h1>New Here?</h1>
          <Link to="/signup">
            <button type="button" className={style.white_btn}>
              Sing Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
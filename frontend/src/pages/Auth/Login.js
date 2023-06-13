import "./Auth.css";

//Componentes
import { Link } from 'react-router-dom';
import Message from '../../components/Message/Message'

//Hooks
import { useState, useEffect } from 'react'; //Hooks do react
import { useSelector, useDispatch } from "react-redux"; //Hooks do Redux

//Redux Actions
import { login, reset } from "../../slices/authSlice";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispath = useDispatch();

  //Pegando estado salvo no nosso reducer "auth"
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    //Criando objeto JSON a partir dos estados preenchidos no formulário (pois back-end está esperando JSON e não form-data):
    const user = {
      email,
      password,
    }
    //Dando dispath na ação de logar usuário:
    dispath(login(user));
  }

  //Resetando estado salvo no reducer "auth" sempre que um dispath for executado:
  useEffect(() => {
    dispath(reset());
  }, [dispath])

  return (
    <div id="login">
      <h2>ReactGram</h2>
      <p className="subtitle">Faça o login para ver as fotos dos seus amigos</p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="E-mail" name="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" name="password" value={password || ""} onChange={(e) => setPassword(e.target.value)} />
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>Não tem uma conta? <Link to="/register">Clique aqui.</Link></p>
    </div>
  )
}

export default Login
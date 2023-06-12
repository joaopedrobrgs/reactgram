import "./Auth.css";

//Componentes
import { Link } from 'react-router-dom';

//Hooks
import { useState, useEffect } from 'react'; //Hooks do react
import { useSelector, useDispatch } from "react-redux"; //Hooks do Redux

//Redux Actions
import {register, reset} from "../../slices/authSlice";

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispath = useDispatch();
  //Pegando estado salvo no nosso reducer "auth"
  const {loading, error} = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword
    }

    console.log(user);

    //Dando dispath na ação de registrar usuário:
    dispath(register(user));
  }

  //Resetando estado salvo no reducer "auth" sempre que um dispath for executado:
  useEffect(()=>{
    dispath(reset());
  }, [dispath])

  return (
    <div id="register">
      <h2>ReactGram</h2>
      <p>Cadastre-se para ver as fotos dos seus amigos</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" name="name" value={name || ""} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="E-mail" name="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" name="password" value={password || ""} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirme a senha" name="confirmpassword" value={confirmPassword || ""} onChange={(e) => setConfirmPassword(e.target.value)} />
        <input type="submit" value="cadastrar" />
      </form>
      <p>Já possui uma conta? <Link to="/login">Clique aqui.</Link></p>
    </div>
  )
}

export default Register
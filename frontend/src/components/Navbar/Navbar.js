import "./Navbar.css";

//Components:
import { NavLink, Link } from "react-router-dom";
import { BsSearch, BsHouseDoorFill, BsFillPersonFill, BsFillCameraFill } from "react-icons/bs"

const Navbar = () => {
  return (
    <nav id="nav">
      {/* Nome do app com link para página inicial: */}
      <Link to="/">Reactgram</Link>
      {/* Formulário de busca: */}
      <form action="">
        <BsSearch />
        <input type="text" />
      </form>
      {/* Links para as páginas do app: */}
      <ul id="nav-links">
        {/* Link para página inicial: */}
        <NavLink to="/">
          <BsHouseDoorFill />
        </NavLink>
        <NavLink to="/login">
          Entrar
        </NavLink>
        <NavLink to="register">
          Cadastrar
        </NavLink>
      </ul>
    </nav>
  )
}

export default Navbar
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
      <form action="" id="search-form">
        <BsSearch />
        <input type="text" placeholder="Pesquisar"/>
      </form>
      {/* Links para as páginas do app: */}
      <ul id="nav-links">
        <li>
          <NavLink to="/">
            <BsHouseDoorFill />
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">
            Entrar
          </NavLink>
        </li>
        <li>
          <NavLink to="register">
            Cadastrar
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
import "./Navbar.css";

//Hooks:
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Components:
import { NavLink, Link } from "react-router-dom";
import { BsSearch, BsHouseDoorFill, BsFillPersonFill, BsFillCameraFill } from "react-icons/bs"

//Redux actions
import { logout, reset } from "../../slices/authSlice";

const Navbar = () => {

  const { auth } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispath = useDispatch();

  const handleLogout = () => {
    dispath(logout());
    dispath(reset());
    navigate("/login");
  }

  return (
    <nav id="nav">
      {/* Nome do app com link para página inicial: */}
      <Link to="/">Reactgram</Link>
      {/* Formulário de busca: */}
      <form action="" id="search-form">
        <BsSearch />
        <input type="text" placeholder="Pesquisar" />
      </form>
      {/* Links para as páginas do app: */}
      <ul id="nav-links">
        {auth ?
          // Navbar para usuários autenticados:
          (
            <>
              <li>
                <NavLink to="/">
                  <BsHouseDoorFill />
                </NavLink>
              </li>
              {user && (
                <>
                  <li>
                    <NavLink to={`/users/${user._id}`}>
                      <BsFillCameraFill />
                    </NavLink>
                  </li>
                </>
              )
              }
              <li>
                <NavLink to="/profile">
                  <BsFillPersonFill />
                </NavLink>
              </li>
              <li>
                <span onClick={handleLogout}>Sair</span>
              </li>
            </>
          )
          :
          // Navbar para usuários não autenticados:
          (
            <>
              <li>
                <NavLink to="/login">
                  Entrar
                </NavLink>
              </li>
              <li>
                <NavLink to="/register">
                  Cadastrar
                </NavLink>
              </li>
            </>
          )
        }
      </ul>
    </nav >
  )
}

export default Navbar
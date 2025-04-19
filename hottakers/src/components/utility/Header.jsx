import plusMark from "../../assets/plusMark.svg";
import { useState, useEffect, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import { useUser } from '../accounts/UserContext';
import '../../css/header.css';

function Header() {
  const { user, isAuthenticated } = useUser();

  function handleClick() {
    console.log("anything");
  }

  return (
    <header>
      <nav>
        <home>
          <a href="#">Hot Takers</a>
        </home>

        <search>
          <input type="text" placeholder="Search Topics" />
        </search>

        <right-nav>
          <feed>
            <Link to="/feed">Feed</Link>
          </feed>
          <Link to="/create-post" className="post">
            <img src={plusMark} alt="plus" />
            <p>Post</p>
          </Link>
          {isAuthenticated ? (
            <profile>
              <Dropdown className="dropdown">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img
                  src= {`http://localhost:8000${user?.pfp}`}
                  alt="profile"
                  className="w-10 h-10 rounded-full"> 
                  
                  </img>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-white shadow-lg rounded-md mt-2">
                  <Dropdown.Item as={Link} to={`/user/${user?.username}`}>Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to={`/settings`}>Settings</Dropdown.Item>
                  <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </profile>
          ) : (
            <login>
              <a 
              href ="/login"
              className = "px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
              >
              Login               
              </a>
            </login>
          )}
        </right-nav>
      </nav>
      <hr></hr>
    </header>
  );
}

export default Header;

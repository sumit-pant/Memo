import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const Login = () => {
  const URI = import.meta.env.VITE_BACKEND_URI;
  const { storeTokenInLS } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URI}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const res_data = await response.json();
      if (response.ok) {
        storeTokenInLS(res_data.token);
        setUser({
          email: "",
          password: ""
        });
        toast.success("Login Successful");
        navigate("/");
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
    } catch (err) {
      console.log(`Error while registration fetching: ${err}`);
    }
  };

  return (
    <>
      <header>
        <div className="brand-name">
          <h1>Our Memos</h1>
        </div>
      </header>
      <div className="logospacer"></div>
      <main>
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter Your Email"
                id="email"
                required
                autoComplete="off"
                value={user.email}
                onChange={handleInput}
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Your Password"
                id="password"
                required
                autoComplete="off"
                value={user.password}
                onChange={handleInput}
              />
            </div>
            <button className="login-btn" type="submit">
              Login
            </button>
          </form>
          <div className="regLog">
            <p>
              New to Our Memos?{" "}
              <NavLink to="/register" className="register-link">
                Register Now..
              </NavLink>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

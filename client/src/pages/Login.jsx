import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

export default function Login() {

  const {
    login
  } = useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const data =
          await login(
            email,
            password
          );

        if (
          data.user.role ===
          "organizer"
        ) {
          navigate("/organizer");
        } else {
          navigate("/");
        }

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Login failed"
        );

      }
    };


  return (
    <div className="auth-container">

      <form
        className="form-card"
        onSubmit={handleSubmit}
      >

        <h2>
          Login
        </h2>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e =>
            setPassword(e.target.value)
          }
          required
        />

        <button className="btn">
          Login
        </button>

        <p>
          Don't have an account?
          {" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}
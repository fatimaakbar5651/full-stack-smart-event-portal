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

export default function Register() {

  const {
    register
  } = useAuth();

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: ""
    });

  const [error, setError] =
    useState("");


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await register(
          form.name,
          form.email,
          form.password
        );

        navigate("/login");

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Registration failed"
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
          Create Account
        </h2>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <input
          placeholder="Full name"
          value={form.name}
          onChange={e =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
          required
        />

        <button className="btn">
          Register
        </button>

        <p>
          Already have an account?
          {" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}
import Jumbotron from "../../components/cards/Jumbotron";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // state
  const [firstName, setFirstName] = useState("La");
  const [lastName, setLastName] = useState("Mimi");
  const [email, setEmail] = useState("lau@gmail.com");
  const [password, setPassword] = useState("1234567890");

  // hook
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Prevent the default behavior of the browser to reload the page
    e.preventDefault();

    try {
      //
      const { data } = await axios.post("/register", {
        firstName,
        lastName,
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Save user and token to local storage
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, user: data.user, token: data.token });
        toast.success("Successfull registration. Please login.");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Register failed. Please try again.");
    }
  };

  return (
    <div>
      <Jumbotron title="Register" />
      {/* mt-5: margin-top 5 */}
      <div className="container mt-5">
        <div className="row">
          {/* offset: have space */}
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <label>First Name</label>
              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Enter you first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
              ></input>
              <label>Last Name</label>
              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Enter you last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoFocus
              ></input>
              <label>Email</label>
              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Enter you email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label>Password</label>
              <input
                type="password"
                className="form-control mb-4 p-2"
                placeholder="Enter you password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(firstName, null, 4)}</pre>
    </div>
  );
}

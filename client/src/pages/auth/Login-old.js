import axios from "axios";
import { useAuth } from "../../context/auth";

export default function Login() {
  const [auth, setAuth] = useAuth();

  async function handleGoogleLogin() {
    await axios
      .get("/auth/google")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <div className="section no-pad-bot" id="index-banner">
        <div className="container">
          <div className="row center">
            <div className="col s6 offset-s3">
              <div className="card">
                <div className="card-content">
                  <span className="card-title">
                    Linkedin Login using Node and passport
                  </span>
                </div>
                <div className="card-action">
                  <a
                    href="/auth/linkedin"
                    className="waves-effect waves-light btn social linkedin"
                  >
                    <i className="fa fa-linkedin"></i> Sign in with Linkedin
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <h1>Login</h1>

        <div className="row">
          <div className="col-sm-8">
            <div className="card">
              <div className="card-body">
                {/* <!-- Makes POST request to /login route --> */}
                <form action="/login" method="POST">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="username"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                    />
                  </div>
                  <button type="submit" className="btn btn-dark">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <button onClick={handleGoogleLogin}>Sign In with Google</button>
              </div>
            </div>
            <div className="card-body">
              <a
                className="btn btn-block btn-social btn-facebook"
                href="/auth/facebook"
                role="button"
              >
                <i className="fab fa-facebook"></i>
                Sign In with Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

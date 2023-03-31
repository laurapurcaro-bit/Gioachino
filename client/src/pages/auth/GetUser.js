import axios from "axios";
export default function GetUser({ auth, setAuth }) {
  const getUser = () => {
    fetch("http://localhost:8000/api/auth/login/success", {
      method: "GET",
      // mode: 'no-cors',
      // withCredentials: true,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Authorization",
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("failed to authenticate user");
      })
      .then((resJson) => {
        localStorage.setItem("auth", JSON.stringify(resJson.user));
        console.log("COOKIES", resJson.cookies);
        // localStorage.setItem("token", JSON.stringify(resJson.token));
        // Put context
        // spread operator: ...auth
        setAuth({
          ...auth,
          user: resJson.user,
          token: resJson.token,
          logged: true,
          isLogout: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUser();
}

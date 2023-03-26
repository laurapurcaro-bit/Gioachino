import { useState } from "react";
import axios from "axios";

export default async function isLoggedIn() {
  const data = await axios
    .get("http://localhost:8000/auth/login/success", {
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
      console.log(resJson.user);
      return resJson.user;
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
}

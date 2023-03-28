//  access context
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";

export default function AdminRoute() {
  //  context
  // eslint-disable-next-line
  const [auth] = useAuth();
  //  state
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const adminCheck = async () => {
      //
      const { data } = await axios.get("/admin-check");
      if (data?.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) adminCheck();
  }, [auth?.token]);
  //   If no authouzation return homepage
  return ok ? <Outlet /> : <Loading path="" />;
}

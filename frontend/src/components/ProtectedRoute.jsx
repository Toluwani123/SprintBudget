import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function ProtectedRoute({ children }) {
  const [isAuthorized, setAuthorized] = useState(null);   // ← start in “loading”

  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) return false;

    try {
      const { data } = await api.post("/accounts/token/refresh/", { refresh });
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      api.defaults.headers.Authorization = `Bearer ${data.access}`;
      return true;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return false;
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      const valid = exp > Date.now() / 1000 || (await refreshToken());
      return valid;
    } catch (err) {
      console.error("Token error:", err);
      return false;
    }
  };

  useEffect(() => {
    auth().then(setAuthorized);
  }, []);

  if (isAuthorized === null) return <div>Loading…</div>;

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

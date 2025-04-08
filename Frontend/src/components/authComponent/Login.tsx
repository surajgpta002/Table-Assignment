import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface LoginPayload {
  email: string;
  password: string;
}

const loginUser = async (payload: LoginPayload): Promise<any> => {
  const response = await api.post(`/login`, payload, {
    withCredentials: true,
  });
  return response.data;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation<any, any, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login Successful", data);
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Login Failed", error);
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  const handleSuccess = async (response: any) => {
    if (!response.credential) {
      console.error("Google OAuth failed: No token received");
      return;
    }
    const token = response.credential;

    await axios.post(
      `${apiUrl}/auth/google`,
      { token },
      { withCredentials: true }
    );

    navigate("/");
  };

  return (
    <div id="signup">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Logging In..." : "Login"}
        </button>
        {mutation.isError && (
          <p style={{ color: "red" }}>
            {mutation.error?.response?.data?.error}
          </p>
        )}

        <div id="google-login">
          <GoogleLogin onSuccess={handleSuccess} />
        </div>
      </form>
    </div>
  );
};

export default Login;

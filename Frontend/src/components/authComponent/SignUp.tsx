import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

const signUpUser: any = async (payload: SignUpPayload): Promise<any> => {
  const response = await api.post(`/signup`, payload, {
    withCredentials: true,
  });
  return response.data;
};

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation<any, any, SignUpPayload>({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      console.log("Signup Successful", data);
      navigate("/profile");
    },
    onError: (error: any) => {
      console.error("Signup Failed", error);
    },
  });

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  };

  return (
    <div id="signup">
      <h1>Signup</h1>
      <form onSubmit={handleSignUp}>
        <label>Name</label>
        <input
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          required
        />
        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing Up..." : "Sign Up"}
        </button>
        {mutation.isError && (
          <p style={{ color: "red" }}>{mutation.error.response.data.error}</p>
        )}
      </form>
    </div>
  );
};

export default SignUp;

import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    axios
      .post(`${apiUrl}/reset-password/${token}`, { password })
      .then(() => {
        alert("password reset Suceess Fully");
        setPassword("");
      })
      .catch((err) => {
        console.error(err.message);
        setPassword("");
      });
  };

  return (
    <div className="reset-password">
      <h1>Reset Password</h1>
      <label htmlFor="">NewPassword</label>
      <input
        type="password"
        name=""
        id=""
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={handleSubmit} type="submit">
        Change Password
      </button>
    </div>
  );
};

export default ResetPassword;

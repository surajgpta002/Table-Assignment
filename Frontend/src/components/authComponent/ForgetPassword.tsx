import axios from "axios";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    axios
      .post(`${apiUrl}/forgot-password`, { email })
      .then(() => {
        alert("email sent Suceess Fully");
        setEmail("");
      })
      .catch((err) => {
        console.error(err.message);
        setEmail("");
      });
  };

  return (
    <div className="forget-password">
      <h1>Forget Password</h1>

      <label htmlFor="">Email</label>
      <input
        type="email"
        name=""
        id=""
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button onClick={handleSubmit} type="submit">
        submit
      </button>
    </div>
  );
};

export default ForgetPassword;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser, loginUser } from '../services/authService'; // Adjust path if needed

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    const signupData = await signupUser(email, password);

    if (!signupData.error) {
      const loginData = await loginUser(email, password);

      if (!loginData.error) {
        if (rememberMe) {
          localStorage.setItem('userEmail', email);
        } else {
          localStorage.removeItem('userEmail');
        }
        navigate('/home');
      } else {
        setMessage('Signup succeeded but auto-login failed.');
      }
    } else {
      setMessage(signupData.error);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSignup}>
        <h2>Create an Account</h2>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-box password-box">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="remember-forgot">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{' '}
            Remember me
          </label>
        </div>

        <button type="submit" className="btn">Signup</button>

        <div className="register-link">
          <p>Already have an account?<Link to="/"> Login</Link></p>
        </div>

        {message && <p className="error">{message}</p>}
      </form>
    </div>
  );
}

export default Signup;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService'; // Make sure this path is correct

function Login() {
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = await loginUser(email, password);

    if (!data.error) {
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('userEmail');
      }
      navigate('/home');
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

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
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="btn">Login</button>

        <div className="register-link">
          <p>Don't have an account?<Link to="/signup"> Register</Link></p>
        </div>

        {message && <p className="error">{message}</p>}
      </form>
    </div>
  );
}

export default Login;

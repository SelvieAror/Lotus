// import React, { useState } from 'react';
// import '../css/login.css';
// import axios from 'axios'; 
// import { useNavigate } from 'react-router-dom'; 

// const SignUpPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       // Send request to your backend API
//       const response = await axios.post('http://localhost:3000', {
//         name,
//         email,
//         password
//       });

//       // Handle successful signup
//       if (response.data.success) {
//         // You might want to store the user token or redirect to login
//         navigate('/login', { state: { signupSuccess: true } });
//       } else {
//         setError(response.data.message || 'Signup failed');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred during signup');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="background">
//       <div className="signup-container">
//         <div className="signup-card">
//           <h2 className="signup-title">Create Your Account</h2>
//           <p className="signup-subtitle">Join us today! It's quick and easy.</p>
//           {error && <div className="error-message">{error}</div>}
//           <form onSubmit={handleSubmit} className="signup-form">
//             <div className="input-group">
//               <label htmlFor="name">Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <div className="password-wrapper">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   minLength="6"
//                 />
//                 <button
//                   type="button"
//                   className="toggle-password-btn"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//             </div>
//             <button 
//               type="submit" 
//               className="signup-btn"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Signing Up...' : 'Sign Up'}
//             </button>
//           </form>
//           <p className="signup-footer">
//             Already have an account? <a href="/login">Login</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;


import React, { useState } from 'react';
import '../css/login.css'; 
const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Name: ${name}\nEmail: ${email}\nPassword: ${password}`);
  };





  


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="background">
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Join us today! It's quick and easy.</p>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>
          <p className="signup-footer">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
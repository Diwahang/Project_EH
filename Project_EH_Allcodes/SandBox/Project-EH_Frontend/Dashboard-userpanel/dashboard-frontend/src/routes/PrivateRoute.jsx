// src/routes/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../auth/auth'; // Import verifyToken function

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = verifyToken(); // Check if token exists and is valid

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="http://localhost:3001/" replace />
  );
};

export default PrivateRoute;

















// src/routes/PrivateRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ element: Component, ...rest }) => {
//   const isAuthenticated = !!localStorage.getItem('accessToken'); // Check for the token

//   return isAuthenticated ? (
//     <Component {...rest} />
//   ) : (
//     // Redirect to another React app or external URL
//     (() => {
//       window.location.href = 'http://localhost:3002/';
//       return null; // Placeholder to avoid any further rendering
//     })()
//     // Alternatively, for React Router navigation:
//     // <Navigate to="http://localhost:3002/" replace />
//   );
// };

// export default PrivateRoute;

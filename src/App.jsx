import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/authStore';
import { AppRoutes } from './router/routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

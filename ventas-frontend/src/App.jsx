import { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import RegistrarVenta from './components/RegistrarVenta.jsx';
import GestionInventario from './components/GestionInventario.jsx';
import GestionCreditos from './components/GestionCreditos.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (token && usuarioGuardado) {
      setIsAuthenticated(true);
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleLogin = (loginData) => {
    setIsAuthenticated(true);
    setUsuario(loginData.usuario);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUsuario(null);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {currentView === 'dashboard' && (
        <Dashboard 
          usuario={usuario} 
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'ventas' && (
        <RegistrarVenta onBack={handleBack} />
      )}
      {currentView === 'inventario' && (
        <GestionInventario onBack={handleBack} />
      )}
      {currentView === 'creditos' && (
        <GestionCreditos onBack={handleBack} />
      )}
    </div>
  );
}

export default App;

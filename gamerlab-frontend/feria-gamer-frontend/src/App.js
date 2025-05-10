import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AppProvider } from './context/AppContext';

// Common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';

// Equipos pages
import EquiposList from './pages/equipos/EquiposList';
import EquipoDetails from './pages/equipos/EquipoDetails';
import EquipoCreate from './pages/equipos/EquipoCreate';

// Videojuegos pages
import VideojuegosList from './pages/videojuegos/VideojuegosList';
import VideojuegoDetails from './pages/videojuegos/VideojuegoDetails';
import VideojuegoCreate from './pages/videojuegos/VideojuegoCreate';

// Jurados pages
import JuradosList from './pages/jurados/JuradosList';
import JuradoDetails from './pages/jurados/JuradoDetails';
import JuradoCreate from './pages/jurados/JuradoCreate';

// Confirmation pages
import ConfirmEstudiante from './pages/confirmation/ConfirmEstudiante';
import ConfirmJurado from './pages/confirmation/ConfirmJurado';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          
          <main className="flex-grow-1 py-4">
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Equipos Routes */}
                <Route path="/equipos" element={<EquiposList />} />
                <Route path="/equipos/crear" element={<EquipoCreate />} />
                <Route path="/equipos/:id" element={<EquipoDetails />} />
                
                {/* Videojuegos Routes */}
                <Route path="/videojuegos" element={<VideojuegosList />} />
                <Route path="/videojuegos/crear" element={<VideojuegoCreate />} />
                <Route path="/videojuegos/:id" element={<VideojuegoDetails />} />
                
                {/* Jurados Routes */}
                <Route path="/jurados" element={<JuradosList />} />
                <Route path="/jurados/crear" element={<JuradoCreate />} />
                <Route path="/jurados/:id" element={<JuradoDetails />} />
                
                {/* Confirmation Routes */}
                <Route path="/confirmar-registro" element={<ConfirmEstudiante />} />
                <Route path="/confirmar-jurado/:token" element={<ConfirmJurado />} />
                
                {/* 404 Route */}
                <Route path="*" element={
                  <div className="text-center py-5">
                    <h1>404 - Página no encontrada</h1>
                    <p>La página que estás buscando no existe.</p>
                  </div>
                } />
              </Routes>
            </Container>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
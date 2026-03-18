import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import CadastroCliente from './pages/CadastroCliente';
import CadastroFuncionario from './pages/CadastroFuncionario';
import CadastroVaga from './pages/CadastroVaga';
import CadastroCandidato from './pages/CadastroCandidato';
import CadastroCandidatura from './pages/CadastroCandidatura';
import CadastroEndereco from './pages/CadastroEndereco';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cadastro">Cadastro Usuário</Link></li>
            <li><Link to="/cadastro-cliente">Cadastro Cliente</Link></li>
            <li><Link to="/cadastro-funcionario">Cadastro Funcionário</Link></li>
            <li><Link to="/cadastro-vaga">Cadastro Vaga</Link></li>
            <li><Link to="/cadastro-candidato">Cadastro Candidato</Link></li>
            <li><Link to="/cadastro-candidatura">Cadastro Candidatura</Link></li>
            <li><Link to="/cadastro-endereco">Solicitar Endereço</Link></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<h1>Sistema de RH</h1>} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
          <Route path="/cadastro-vaga" element={<CadastroVaga />} />
          <Route path="/cadastro-candidato" element={<CadastroCandidato />} />
          <Route path="/cadastro-candidatura" element={<CadastroCandidatura />} />
          <Route path="/cadastro-endereco" element={<CadastroEndereco />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import CadastroCliente from './pages/CadastroCliente';
import CadastroFuncionario from './pages/CadastroFuncionario';
import CadastroVaga from './pages/CadastroVaga';
import CadastroCandidato from './pages/CadastroCandidato';
import CadastroCandidatura from './pages/CadastroCandidatura';
import CadastroEndereco from './pages/CadastroEndereco';
import ListarUsuarios from './pages/ListarUsuarios';
import EditarUsuario from './pages/EditarUsuario';
import ListarClientes from './pages/ListarClientes';
import EditarCliente from './pages/EditarCliente';
import ListarFuncionarios from './pages/ListarFuncionarios';
import EditarFuncionario from './pages/EditarFuncionario';
import ListarVagas from './pages/ListarVagas';
import EditarVaga from './pages/EditarVaga';
import ListarCandidatos from './pages/ListarCandidatos';
import EditarCandidato from './pages/EditarCandidato';
import ListarCandidaturas from './pages/ListarCandidaturas';
import EditarCandidatura from './pages/EditarCandidatura';
import ListarEnderecos from './pages/ListarEnderecos';
import EditarEndereco from './pages/EditarEndereco';
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
            <li><Link to="/listar-usuarios">Listar Usuários</Link></li>
            <li><Link to="/listar-clientes">Listar Clientes</Link></li>
            <li><Link to="/listar-funcionarios">Listar Funcionários</Link></li>
            <li><Link to="/listar-vagas">Listar Vagas</Link></li>
            <li><Link to="/listar-candidatos">Listar Candidatos</Link></li>
            <li><Link to="/listar-candidaturas">Listar Candidaturas</Link></li>
            <li><Link to="/listar-enderecos">Listar Endereços</Link></li>
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
          <Route path="/listar-usuarios" element={<ListarUsuarios />} />
          <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
          <Route path="/listar-clientes" element={<ListarClientes />} />
          <Route path="/editar-cliente/:id" element={<EditarCliente />} />
          <Route path="/listar-funcionarios" element={<ListarFuncionarios />} />
          <Route path="/editar-funcionario/:id" element={<EditarFuncionario />} />
          <Route path="/listar-vagas" element={<ListarVagas />} />
          <Route path="/editar-vaga/:id" element={<EditarVaga />} />
          <Route path="/listar-candidatos" element={<ListarCandidatos />} />
          <Route path="/editar-candidato/:id" element={<EditarCandidato />} />
          <Route path="/listar-candidaturas" element={<ListarCandidaturas />} />
          <Route path="/editar-candidatura/:id" element={<EditarCandidatura />} />
          <Route path="/listar-enderecos" element={<ListarEnderecos />} />
          <Route path="/editar-endereco/:id" element={<EditarEndereco />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

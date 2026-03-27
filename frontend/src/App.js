import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardRH from './pages/DashboardRH';
import Cadastro from './pages/Cadastro';
import CadastroCliente from './pages/CadastroCliente';
import CadastroFuncionario from './pages/CadastroFuncionario';
import CadastroVaga from './pages/CadastroVaga';
import CadastroCandidato from './pages/CadastroCandidato';
import CadastroCandidatura from './pages/CadastroCandidatura';
import CadastroEndereco from './pages/CadastroEndereco';
import ListarUsuarios from './pages/ListarUsuarios';
import ListarClientes from './pages/ListarClientes';
import ListarFuncionarios from './pages/ListarFuncionarios';
import ListarVagas from './pages/ListarVagas';
import ListarCandidatos from './pages/ListarCandidatos';
import ListarCandidaturas from './pages/ListarCandidaturas';
import ListarEnderecos from './pages/ListarEnderecos';
import EditarUsuario from './pages/EditarUsuario';
import EditarCliente from './pages/EditarCliente';
import EditarFuncionario from './pages/EditarFuncionario';
import EditarVaga from './pages/EditarVaga';
import EditarCandidato from './pages/EditarCandidato';
import EditarCandidatura from './pages/EditarCandidatura';
import EditarEndereco from './pages/EditarEndereco';
import DashboardCliente from './pages/DashboardCliente';
import DashboardFuncionario from './pages/DashboardFuncionario';
import DashboardCandidato from './pages/DashboardCandidato';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-rh" element={<DashboardRH />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
        <Route path="/cadastro-vaga" element={<CadastroVaga />} />
        <Route path="/cadastro-candidato" element={<CadastroCandidato />} />
        <Route path="/cadastro-candidatura" element={<CadastroCandidatura />} />
        <Route path="/cadastro-endereco" element={<CadastroEndereco />} />
        <Route path="/listar-usuarios" element={<ListarUsuarios />} />
        <Route path="/listar-clientes" element={<ListarClientes />} />
        <Route path="/listar-funcionarios" element={<ListarFuncionarios />} />
        <Route path="/listar-vagas" element={<ListarVagas />} />
        <Route path="/listar-candidatos" element={<ListarCandidatos />} />
        <Route path="/listar-candidaturas" element={<ListarCandidaturas />} />
        <Route path="/listar-enderecos" element={<ListarEnderecos />} />
        <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
        <Route path="/editar-cliente/:id" element={<EditarCliente />} />
        <Route path="/editar-funcionario/:id" element={<EditarFuncionario />} />
        <Route path="/editar-vaga/:id" element={<EditarVaga />} />
        <Route path="/editar-candidato/:id" element={<EditarCandidato />} />
        <Route path="/editar-candidatura/:id" element={<EditarCandidatura />} />
        <Route path="/editar-endereco/:id" element={<EditarEndereco />} />
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/dashboard-funcionario" element={<DashboardFuncionario />} />
        <Route path="/dashboard-candidato" element={<DashboardCandidato />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

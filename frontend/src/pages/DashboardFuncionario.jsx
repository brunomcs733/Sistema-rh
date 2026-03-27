import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function DashboardFuncionario() {
  const [usuario, setUsuario] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (usuarioSalvo) {
      const user = JSON.parse(usuarioSalvo);
      setUsuario(user);
      carregarDadosFuncionario(user.id);
    }
  }, [navigate]);

  const carregarDadosFuncionario = async (usuarioId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Buscar funcionário vinculado ao usuário
      const funcRes = await api.get('/funcionarios', { headers });
      const funcData = funcRes.data.find(f => f.usuario_id === usuarioId);
      setFuncionario(funcData);
      
      if (funcData) {
        // Buscar cliente
        const clientesRes = await api.get('/clientes', { headers });
        const clienteData = clientesRes.data.find(c => c.id === funcData.cliente_id);
        setCliente(clienteData);
        
        // Buscar endereços do funcionário
        const enderecosRes = await api.get('/enderecos', { headers });
        const enderecosFunc = enderecosRes.data.filter(e => e.funcionario_id === funcData.id);
        setEnderecos(enderecosFunc);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do funcionário:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>Sistema RH</h1>
        </div>
        <div className="nav-user">
          <span>Olá, {usuario?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Dashboard Funcionário</h2>
        
        {funcionario && (
          <div className="info-card">
            <h3>Seus Dados</h3>
            <p><strong>Nome:</strong> {funcionario.nome}</p>
            <p><strong>CPF:</strong> {funcionario.cpf}</p>
            <p><strong>Cargo:</strong> {funcionario.cargo || '-'}</p>
            <p><strong>Data de Admissão:</strong> {funcionario.data_admissao}</p>
            {cliente && <p><strong>Empresa:</strong> {cliente.razao_social}</p>}
          </div>
        )}
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Solicitações de Endereço</h3>
            <p className="stat-number">{enderecos.length}</p>
            <Link to="/listar-enderecos" className="stat-link">Ver histórico</Link>
          </div>
        </div>
        
        <div className="actions-section">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <Link to="/cadastro-endereco" className="action-btn">Solicitar Alteração de Endereço</Link>
            <Link to="/listar-enderecos" className="action-btn">Ver Minhas Solicitações</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardFuncionario;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function DashboardCliente() {
  const [usuario, setUsuario] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [funcionarios, setFuncionarios] = useState([]);
  const [vagas, setVagas] = useState([]);
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
      carregarDadosCliente(user.id);
    }
  }, [navigate]);

  const carregarDadosCliente = async (usuarioId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Buscar cliente vinculado ao usuário
      const clientesRes = await api.get('/clientes', { headers });
      const clienteData = clientesRes.data.find(c => c.usuario_id === usuarioId);
      setCliente(clienteData);
      
      if (clienteData) {
        // Buscar funcionários do cliente
        const funcRes = await api.get('/funcionarios', { headers });
        const funcs = funcRes.data.filter(f => f.cliente_id === clienteData.id);
        setFuncionarios(funcs);
        
        // Buscar vagas do cliente
        const vagasRes = await api.get('/vagas', { headers });
        const vagasCliente = vagasRes.data.filter(v => v.cliente_id === clienteData.id);
        setVagas(vagasCliente);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
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
        <h2>Dashboard Cliente</h2>
        
        {cliente && (
          <div className="info-card">
            <h3>Sua Empresa</h3>
            <p><strong>Razão Social:</strong> {cliente.razao_social}</p>
            <p><strong>CNPJ:</strong> {cliente.cnpj}</p>
            <p><strong>Contato:</strong> {cliente.contato || '-'}</p>
          </div>
        )}
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Funcionários</h3>
            <p className="stat-number">{funcionarios.length}</p>
            <Link to="/listar-funcionarios" className="stat-link">Ver todos</Link>
          </div>
          
          <div className="stat-card">
            <h3>Vagas Abertas</h3>
            <p className="stat-number">{vagas.filter(v => v.ativa).length}</p>
            <Link to="/listar-vagas" className="stat-link">Ver todas</Link>
          </div>
        </div>
        
        <div className="actions-section">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <Link to="/cadastro-funcionario" className="action-btn">+ Novo Funcionário</Link>
            <Link to="/cadastro-vaga" className="action-btn">+ Nova Vaga</Link>
            <Link to="/listar-funcionarios" className="action-btn">Ver Funcionários</Link>
            <Link to="/listar-vagas" className="action-btn">Ver Vagas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCliente;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function DashboardRH() {
  const [usuario, setUsuario] = useState(null);
  const [estatisticas, setEstatisticas] = useState({
    totalUsuarios: 0,
    totalClientes: 0,
    totalFuncionarios: 0,
    totalVagas: 0,
    totalCandidatos: 0,
    totalCandidaturas: 0
  });
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
      setUsuario(JSON.parse(usuarioSalvo));
    }
    
    carregarEstatisticas();
  }, [navigate]);

  const carregarEstatisticas = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [usuariosRes, clientesRes, funcionariosRes, vagasRes, candidatosRes, candidaturasRes, enderecosRes] = await Promise.all([
        api.get('/usuarios', { headers }),
        api.get('/clientes', { headers }),
        api.get('/funcionarios', { headers }),
        api.get('/vagas', { headers }),
        api.get('/candidatos', { headers }),
        api.get('/candidaturas', { headers }),
        api.get('/enderecos', { headers })
      ]);
      
      setEstatisticas({
        totalUsuarios: usuariosRes.data.length,
        totalClientes: clientesRes.data.length,
        totalFuncionarios: funcionariosRes.data.length,
        totalVagas: vagasRes.data.length,
        totalCandidatos: candidatosRes.data.length,
        totalCandidaturas: candidaturasRes.data.length,
        totalEnderecos: enderecosRes.data.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
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
        <h2>Dashboard RH</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Usuários</h3>
            <p className="stat-number">{estatisticas.totalUsuarios}</p>
            <Link to="/listar-usuarios" className="stat-link">Ver todos</Link>
          </div>
          
          <div className="stat-card">
            <h3>Clientes</h3>
            <p className="stat-number">{estatisticas.totalClientes}</p>
            <Link to="/listar-clientes" className="stat-link">Ver todos</Link>
          </div>
          
          <div className="stat-card">
            <h3>Funcionários</h3>
            <p className="stat-number">{estatisticas.totalFuncionarios}</p>
            <Link to="/listar-funcionarios" className="stat-link">Ver todos</Link>
          </div>
          
          <div className="stat-card">
            <h3>Vagas</h3>
            <p className="stat-number">{estatisticas.totalVagas}</p>
            <Link to="/listar-vagas" className="stat-link">Ver todas</Link>
          </div>
          
          <div className="stat-card">
            <h3>Candidatos</h3>
            <p className="stat-number">{estatisticas.totalCandidatos}</p>
            <Link to="/listar-candidatos" className="stat-link">Ver todos</Link>
          </div>
          
          <div className="stat-card">
            <h3>Candidaturas</h3>
            <p className="stat-number">{estatisticas.totalCandidaturas}</p>
            <Link to="/listar-candidaturas" className="stat-link">Ver todas</Link>
          </div>

          <div className="stat-card">
            <h3>Solicitações de Endereço</h3>
            <p className="stat-number">{estatisticas.totalEnderecos}</p>
            <Link to="/listar-enderecos" className="stat-link">Ver todas</Link>
          </div>
        </div>
        
        <div className="actions-section">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <Link to="/cadastro" className="action-btn">+ Novo Usuário</Link>
            <Link to="/cadastro-cliente" className="action-btn">+ Novo Cliente</Link>
            <Link to="/cadastro-funcionario" className="action-btn">+ Novo Funcionário</Link>
            <Link to="/cadastro-vaga" className="action-btn">+ Nova Vaga</Link>
            <Link to="/cadastro-candidato" className="action-btn">+ Novo Candidato</Link>
            <Link to="/cadastro-candidatura" className="action-btn">+ Nova Candidatura</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardRH;

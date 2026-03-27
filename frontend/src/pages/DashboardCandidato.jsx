import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function DashboardCandidato() {
  const [usuario, setUsuario] = useState(null);
  const [candidato, setCandidato] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
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
      carregarDadosCandidato(user.id);
    }
  }, [navigate]);

  const carregarDadosCandidato = async (usuarioId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Buscar candidato vinculado ao usuário
      const candidatosRes = await api.get('/candidatos', { headers });
      const candidatoData = candidatosRes.data.find(c => c.usuario_id === usuarioId);
      setCandidato(candidatoData);
      
      // Buscar vagas ativas
      const vagasRes = await api.get('/vagas', { headers });
      setVagas(vagasRes.data.filter(v => v.ativa));
      
      // Buscar candidaturas do candidato
      const candidaturasRes = await api.get('/candidaturas', { headers });
      setCandidaturas(candidaturasRes.data.filter(c => c.candidato_id === candidatoData?.id));
    } catch (error) {
      console.error('Erro ao carregar dados do candidato:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pendente': '⏳ Pendente',
      'em_analise': '🔍 Em Análise',
      'aprovado': '✅ Aprovado',
      'recusado': '❌ Recusado',
      'contratado': '🎉 Contratado'
    };
    return statusMap[status] || status;
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
        <h2>Dashboard Candidato</h2>
        
        {candidato && (
          <div className="info-card">
            <h3>Seus Dados</h3>
            <p><strong>Nome:</strong> {candidato.nome}</p>
            <p><strong>CPF:</strong> {candidato.cpf}</p>
            <p><strong>Email:</strong> {candidato.email}</p>
            <p><strong>Telefone:</strong> {candidato.telefone || '-'}</p>
          </div>
        )}
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Vagas Disponíveis</h3>
            <p className="stat-number">{vagas.length}</p>
            <Link to="/listar-vagas" className="stat-link">Ver todas</Link>
          </div>
          
          <div className="stat-card">
            <h3>Minhas Candidaturas</h3>
            <p className="stat-number">{candidaturas.length}</p>
            <Link to="/listar-candidaturas" className="stat-link">Ver todas</Link>
          </div>
        </div>
        
        {candidaturas.length > 0 && (
          <div className="recent-section">
            <h3>Últimas Candidaturas</h3>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Vaga</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {candidaturas.slice(0, 5).map(c => {
                  const vaga = vagas.find(v => v.id === c.vaga_id);
                  return (
                    <tr key={c.id}>
                      <td>{c.data_candidatura?.split('T')[0]}</td>
                      <td>{vaga?.titulo || `Vaga ${c.vaga_id}`}</td>
                      <td className={`status-${c.status}`}>{getStatusLabel(c.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="actions-section">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <Link to="/listar-vagas" className="action-btn">Ver Vagas Disponíveis</Link>
            <Link to="/listar-candidaturas" className="action-btn">Ver Minhas Candidaturas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCandidato;


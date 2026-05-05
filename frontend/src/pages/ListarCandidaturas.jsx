import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarCandidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarCandidaturas();
  }, []);

  const carregarCandidaturas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/candidaturas');
      setCandidaturas(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar candidaturas');
      console.error(error);
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

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta candidatura?')) {
      try {
        await api.delete(`/candidaturas/${id}`);
        carregarCandidaturas();
      } catch (error) {
        alert('Erro ao excluir candidatura');
      }
    }
  };

  const formatarData = (data) => {
    if (!data) return '-';
    const date = new Date(data);
    return date.toLocaleString('pt-BR');
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
  <div className="listar-container">
    <div className="botoes-container">
      <button onClick={() => navigate('/dashboard-rh')} className="btn-novo">
        ⬅️ Voltar
      </button>
      <Link to="/cadastro-candidatura" className="btn-novo">
        + Nova Candidatura
      </Link>
    </div>

    <h1>Lista de Candidaturas</h1>
    
    {erro && <div className="erro">{erro}</div>}

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Vaga ID</th>
            <th>Título da Vaga</th>
            <th>Candidato ID</th>
            <th>Nome do Candidato</th>
            <th>Empresa</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {candidaturas.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                Nenhuma candidatura encontrada
              </td>
            </tr>
          ) : (
            candidaturas.map(candidatura => (
              <tr key={candidatura.id}>
                <td>{candidatura.id}</td>
                <td>{formatarData(candidatura.data_candidatura)}</td>
                <td>{candidatura.vaga_id}</td>
                <td>{candidatura.titulo || '-'}</td>
                <td>{candidatura.candidato_id}</td>
                <td>{candidatura.nome || '-'}</td>
                <td>{candidatura.razao_social || '-'}</td>
                <td className={`status-${candidatura.status}`}>
                  {getStatusLabel(candidatura.status)}
                </td>
                <td className="acoes">
                  <Link to={`/editar-candidatura/${candidatura.id}`} className="btn-editar">
                    Editar
                  </Link>
                  <button onClick={() => handleExcluir(candidatura.id)} className="btn-excluir">
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListarCandidaturas;

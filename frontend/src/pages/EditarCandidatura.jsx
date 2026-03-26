import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Editar.css';

function EditarCandidatura() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    status: ''
  });
  const [candidaturaInfo, setCandidaturaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const statusOptions = [
    { valor: 'pendente', label: '⏳ Pendente' },
    { valor: 'em_analise', label: '🔍 Em Análise' },
    { valor: 'aprovado', label: '✅ Aprovado' },
    { valor: 'recusado', label: '❌ Recusado' },
    { valor: 'contratado', label: '🎉 Contratado' }
  ];

  useEffect(() => {
    carregarCandidatura();
  }, [id]);

  const carregarCandidatura = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/candidaturas/${id}`);
      setCandidaturaInfo({
        id: response.data.id,
        data_candidatura: response.data.data_candidatura,
        vaga_id: response.data.vaga_id,
        candidato_id: response.data.candidato_id
      });
      setFormData({
        status: response.data.status
      });
    } catch (error) {
      setErro('Erro ao carregar dados da candidatura');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    try {
      await api.put(`/candidaturas/${id}`, formData);
      setMensagem('Candidatura atualizada com sucesso!');
      setTimeout(() => {
        navigate('/listar-candidaturas');
      }, 1500);
    } catch (error) {
      if (error.response) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro de conexão com o servidor');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="editar-container">
      <h1>Editar Candidatura</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      {candidaturaInfo && (
        <div className="info-card">
          <h3>Informações da Candidatura</h3>
          <p><strong>ID:</strong> {candidaturaInfo.id}</p>
          <p><strong>Data:</strong> {candidaturaInfo.data_candidatura}</p>
          <p><strong>Vaga ID:</strong> {candidaturaInfo.vaga_id}</p>
          <p><strong>Candidato ID:</strong> {candidaturaInfo.candidato_id}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Status da Candidatura:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {statusOptions.map(opt => (
              <option key={opt.valor} value={opt.valor}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/listar-candidaturas')} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCandidatura;

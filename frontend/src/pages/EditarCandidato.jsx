import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Editar.css';

function EditarCandidato() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarCandidato();
  }, [id]);

  const carregarCandidato = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/candidatos/${id}`);
      setFormData({
        nome: response.data.nome,
        cpf: response.data.cpf,
        email: response.data.email,
        telefone: response.data.telefone || ''
      });
    } catch (error) {
      setErro('Erro ao carregar dados do candidato');
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
      await api.put(`/candidatos/${id}`, formData);
      setMensagem('Candidato atualizado com sucesso!');
      setTimeout(() => {
        navigate('/listar-candidatos');
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
      <h1>Editar Candidato</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>CPF:</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            maxLength="11"
            required
          />
          <small>Apenas números</small>
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/listar-candidatos')} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCandidato;

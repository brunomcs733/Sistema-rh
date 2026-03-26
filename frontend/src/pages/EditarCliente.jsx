import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Editar.css';

function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cnpj: '',
    razao_social: '',
    nome_fantasia: '',
    contato: '',
    usuario_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarCliente();
  }, [id]);

  const carregarCliente = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/clientes/${id}`);
      setFormData({
        cnpj: response.data.cnpj,
        razao_social: response.data.razao_social,
        nome_fantasia: response.data.nome_fantasia || '',
        contato: response.data.contato || '',
        usuario_id: response.data.usuario_id || ''
      });
    } catch (error) {
      setErro('Erro ao carregar dados do cliente');
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
      await api.put(`/clientes/${id}`, formData);
      setMensagem('Cliente atualizado com sucesso!');
      setTimeout(() => {
        navigate('/listar-clientes');
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
      <h1>Editar Cliente</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>CNPJ:</label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            maxLength="14"
            required
          />
          <small>Apenas números</small>
        </div>

        <div className="form-group">
          <label>Razão Social:</label>
          <input
            type="text"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nome Fantasia:</label>
          <input
            type="text"
            name="nome_fantasia"
            value={formData.nome_fantasia}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Contato:</label>
          <input
            type="text"
            name="contato"
            value={formData.contato}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>ID do Usuário Responsável:</label>
          <input
            type="number"
            name="usuario_id"
            value={formData.usuario_id}
            onChange={handleChange}
          />
          <small>Opcional</small>
        </div>

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/listar-clientes')} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCliente;

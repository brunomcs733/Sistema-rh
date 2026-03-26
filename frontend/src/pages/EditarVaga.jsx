import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Editar.css';

function EditarVaga() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    salario: '',
    data_encerramento: '',
    ativa: true,
    cliente_id: ''
  });
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar lista de clientes para o select
      const clientesResponse = await api.get('/clientes');
      setClientes(clientesResponse.data);
      
      // Carregar dados da vaga
      const vagaResponse = await api.get(`/vagas/${id}`);
      setFormData({
        titulo: vagaResponse.data.titulo,
        descricao: vagaResponse.data.descricao,
        requisitos: vagaResponse.data.requisitos || '',
        salario: vagaResponse.data.salario || '',
        data_encerramento: vagaResponse.data.data_encerramento || '',
        ativa: vagaResponse.data.ativa,
        cliente_id: vagaResponse.data.cliente_id || ''
      });
    } catch (error) {
      setErro('Erro ao carregar dados da vaga');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    try {
      await api.put(`/vagas/${id}`, formData);
      setMensagem('Vaga atualizada com sucesso!');
      setTimeout(() => {
        navigate('/listar-vagas');
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
      <h1>Editar Vaga</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título da Vaga:</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Requisitos:</label>
          <textarea
            name="requisitos"
            value={formData.requisitos}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Salário (R$):</label>
          <input
            type="number"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Data de Encerramento:</label>
          <input
            type="date"
            name="data_encerramento"
            value={formData.data_encerramento}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="ativa"
              checked={formData.ativa}
              onChange={handleChange}
            />
            Vaga ativa (receber candidaturas)
          </label>
        </div>

        <div className="form-group">
          <label>Cliente (empresa):</label>
          <select
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razao_social}
              </option>
            ))}
          </select>
        </div>

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/listar-vagas')} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarVaga;

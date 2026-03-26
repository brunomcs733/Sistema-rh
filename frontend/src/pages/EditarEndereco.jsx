import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Editar.css';

function EditarEndereco() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    status: '',
    motivo_rejeicao: ''
  });
  const [enderecoInfo, setEnderecoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [comprovanteUrl, setComprovanteUrl] = useState(null);

  useEffect(() => {
    carregarEndereco();
  }, [id]);

  const carregarEndereco = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/enderecos/${id}`);
      setEnderecoInfo({
        id: response.data.id,
        logradouro: response.data.logradouro,
        numero: response.data.numero,
        complemento: response.data.complemento,
        bairro: response.data.bairro,
        cidade: response.data.cidade,
        estado: response.data.estado,
        cep: response.data.cep,
        funcionario_id: response.data.funcionario_id,
        data_solicitacao: response.data.data_solicitacao,
        comprovante_nome: response.data.comprovante_nome
      });
      setFormData({
        status: response.data.status,
        motivo_rejeicao: response.data.motivo_rejeicao || ''
      });
    } catch (error) {
      setErro('Erro ao carregar dados da solicitação');
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
      await api.put(`/enderecos/${id}`, formData);
      setMensagem('Solicitação atualizada com sucesso!');
      setTimeout(() => {
        navigate('/listar-enderecos');
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
      <h1>Gerenciar Solicitação de Endereço</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      {enderecoInfo && (
        <div className="info-card">
          <h3>Informações da Solicitação</h3>
          <p><strong>ID:</strong> {enderecoInfo.id}</p>
          <p><strong>Funcionário ID:</strong> {enderecoInfo.funcionario_id}</p>
          <p><strong>Data:</strong> {enderecoInfo.data_solicitacao}</p>
          
          <h4>Endereço Solicitado:</h4>
          <p>
            {enderecoInfo.logradouro}, {enderecoInfo.numero}
            {enderecoInfo.complemento ? `, ${enderecoInfo.complemento}` : ''}
          </p>
          <p>{enderecoInfo.bairro} - {enderecoInfo.cidade}/{enderecoInfo.estado}</p>
          <p>CEP: {enderecoInfo.cep}</p>
          
          {enderecoInfo.comprovante_nome && (
            <p><strong>Comprovante:</strong> {enderecoInfo.comprovante_nome}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="pendente">⏳ Pendente</option>
            <option value="aprovado">✅ Aprovado</option>
            <option value="rejeitado">❌ Rejeitado</option>
          </select>
        </div>

        {formData.status === 'rejeitado' && (
          <div className="form-group">
            <label>Motivo da Rejeição:</label>
            <textarea
              name="motivo_rejeicao"
              value={formData.motivo_rejeicao}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Informe o motivo da rejeição..."
            />
          </div>
        )}

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/listar-enderecos')} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarEndereco;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Editar.css';

function EditarFuncionario() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    data_admissao: '',
    cliente_id: '',
    usuario_id: ''
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
      
      // Carregar dados do funcionário
      const funcResponse = await api.get(`/funcionarios/${id}`);
      setFormData({
        nome: funcResponse.data.nome,
        cpf: funcResponse.data.cpf,
        cargo: funcResponse.data.cargo || '',
        data_admissao: funcResponse.data.data_admissao || '',
        cliente_id: funcResponse.data.cliente_id || '',
        usuario_id: funcResponse.data.usuario_id || ''
      });
    } catch (error) {
      setErro('Erro ao carregar dados do funcionário');
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
      await api.put(`/funcionarios/${id}`, formData);
      setMensagem('Funcionário atualizado com sucesso!');
      setTimeout(() => {
        navigate('/listar-funcionarios');
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
      <h1>Editar Funcionário</h1>
      
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
          <label>Cargo:</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Data de Admissão:</label>
          <input
            type="date"
            name="data_admissao"
            value={formData.data_admissao}
            onChange={handleChange}
            required
          />
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

        <div className="form-group">
          <label>ID do Usuário (opcional):</label>
          <input
            type="number"
            name="usuario_id"
            value={formData.usuario_id}
            onChange={handleChange}
          />
        </div>

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/listar-funcionarios')} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarFuncionario;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Cadastro.css';

function CadastroFuncionario() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    data_admissao: '',
    cliente_id: '',
    usuario_id: ''
  });
  const [clientes, setClientes] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // Buscar lista de clientes para o select
  useEffect(() => {
  const buscarClientes = async () => {
    console.log('Iniciando busca de clientes...');
    try {
      const response = await api.get('/clientes');
      console.log('Resposta recebida:', response);
      console.log('Dados:', response.data);
      setClientes(response.data);
    } catch (error) {
      console.error('ERRO DETALHADO:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Dados:', error.response.data);
      } else if (error.request) {
        console.error('Sem resposta do servidor');
      } else {
        console.error('Erro na requisição:', error.message);
      }
    }
  };
  buscarClientes();
}, []);

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

    // Preparar dados para envio
    const dadosParaEnviar = {
      nome: formData.nome,
      cpf: formData.cpf,
      cargo: formData.cargo,
      data_admissao: formData.data_admissao,
      cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
      usuario_id: formData.usuario_id === '' ? null : parseInt(formData.usuario_id)
    };

    try {
      const response = await api.post('/funcionarios', dadosParaEnviar);
      setMensagem(response.data.mensagem);
      setFormData({
        nome: '',
        cpf: '',
        cargo: '',
        data_admissao: '',
        cliente_id: '',
        usuario_id: ''
      });
    } catch (error) {
      if (error.response) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro de conexão com o servidor');
      }
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Funcionário</h1>
      
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
          <label>CPF (apenas números):</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            maxLength="11"
            required
          />
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
                {cliente.razao_social} (ID: {cliente.id})
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

        <button type="submit">Cadastrar Funcionário</button>
      </form>
    </div>
  );
}

export default CadastroFuncionario;

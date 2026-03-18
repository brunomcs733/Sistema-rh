import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Cadastro.css';

function CadastroVaga() {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    salario: '',
    data_encerramento: '',
    cliente_id: ''
  });
  const [clientes, setClientes] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // Buscar clientes para o select
  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
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

    const dadosParaEnviar = {
      ...formData,
      cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
      salario: formData.salario ? parseFloat(formData.salario) : null
    };

    try {
      const response = await api.post('/vagas', dadosParaEnviar);
      setMensagem(response.data.mensagem);
      setFormData({
        titulo: '',
        descricao: '',
        requisitos: '',
        salario: '',
        data_encerramento: '',
        cliente_id: ''
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
      <h1>Cadastro de Vaga</h1>
      
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

        <button type="submit">Cadastrar Vaga</button>
      </form>
    </div>
  );
}

export default CadastroVaga;

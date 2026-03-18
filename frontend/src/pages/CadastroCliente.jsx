import React, { useState } from 'react';
import api from '../services/api';
import './Cadastro.css';

function CadastroCliente() {
  const [formData, setFormData] = useState({
    cnpj: '',
    razao_social: '',
    nome_fantasia: '',
    contato: '',
    usuario_id: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

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

  // Preparar dados para envio - CONVERTE CAMPO VAZIO PARA NULL
  const dadosParaEnviar = {
    cnpj: formData.cnpj,
    razao_social: formData.razao_social,
    nome_fantasia: formData.nome_fantasia,
    contato: formData.contato,
    usuario_id: formData.usuario_id === '' ? null : parseInt(formData.usuario_id)
  };

  try {
    const response = await api.post('/clientes', dadosParaEnviar);  // ← USAR dadosParaEnviar
      setMensagem(response.data.mensagem);
      setFormData({
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        contato: '',
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
      <h1>Cadastro de Cliente</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>CNPJ (apenas números):</label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            maxLength="14"
            required
          />
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
          <label>Contato (email/telefone):</label>
          <input
            type="text"
            name="contato"
            value={formData.contato}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>ID do Usuário Responsável (opcional):</label>
          <input
            type="number"
            name="usuario_id"
            value={formData.usuario_id}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Cadastrar Cliente</button>
      </form>
    </div>
  );
}

export default CadastroCliente;

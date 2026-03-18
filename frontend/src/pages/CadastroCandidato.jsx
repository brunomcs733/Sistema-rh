import React, { useState } from 'react';
import api from '../services/api';
import './Cadastro.css';

function CadastroCandidato() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
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

    const dadosParaEnviar = {
      ...formData,
      usuario_id: formData.usuario_id === '' ? null : parseInt(formData.usuario_id)
    };

    try {
      const response = await api.post('/candidatos', dadosParaEnviar);
      setMensagem(response.data.mensagem);
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
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
      <h1>Cadastro de Candidato</h1>
      
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

        <div className="form-group">
          <label>ID do Usuário (opcional):</label>
          <input
            type="number"
            name="usuario_id"
            value={formData.usuario_id}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Cadastrar Candidato</button>
      </form>
    </div>
  );
}

export default CadastroCandidato;

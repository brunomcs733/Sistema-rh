import React, { useState } from 'react';
import api from '../services/api';
import './Cadastro.css';

function Cadastro() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    perfil: 'rh'
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const perfis = [
    { valor: 'rh', label: 'RH' },
    { valor: 'cliente', label: 'Cliente' },
    { valor: 'funcionario', label: 'Funcionário' },
    { valor: 'candidato', label: 'Candidato' }
  ];

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
      const response = await api.post('/usuarios', formData);
      setMensagem(response.data.mensagem);
      setFormData({ email: '', senha: '', perfil: 'rh' });
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
      <h1>Cadastro de Usuário</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
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
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Perfil:</label>
          <select
            name="perfil"
            value={formData.perfil}
            onChange={handleChange}
          >
            {perfis.map(p => (
              <option key={p.valor} value={p.valor}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;

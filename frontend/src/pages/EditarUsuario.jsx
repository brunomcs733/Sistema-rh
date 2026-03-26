import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Editar.css';

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    perfil: ''
  });
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const perfis = [
    { valor: 'rh', label: 'RH' },
    { valor: 'cliente', label: 'Cliente' },
    { valor: 'funcionario', label: 'Funcionário' },
    { valor: 'candidato', label: 'Candidato' }
  ];

  useEffect(() => {
    carregarUsuario();
  }, [id]);

  const carregarUsuario = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/usuarios/${id}`);
      setFormData({
        email: response.data.email,
        perfil: response.data.perfil
      });
    } catch (error) {
      setErro('Erro ao carregar dados do usuário');
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
      await api.put(`/usuarios/${id}`, formData);
      setMensagem('Usuário atualizado com sucesso!');
      setTimeout(() => {
        navigate('/listar-usuarios');
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
      <h1>Editar Usuário</h1>
      
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
          <label>Perfil:</label>
          <select
            name="perfil"
            value={formData.perfil}
            onChange={handleChange}
            required
          >
            {perfis.map(p => (
              <option key={p.valor} value={p.valor}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="botoes">
          <button type="submit" className="btn-salvar">Salvar Alterações</button>
          <button type="button" onClick={() => navigate('/listar-usuarios')} className="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
      } catch (error) {
        alert('Erro ao excluir usuário');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
 <div className="listar-container">
    <div className="botoes-container">
      <button onClick={() => navigate('/dashboard-rh')} className="btn-novo">
        ⬅️ Voltar
      </button>
      <Link to="/cadastro" className="btn-novo">
        + Novo Usuário
      </Link>
    </div>

    <h1>Lista de Usuários</h1>
    
    {erro && <div className="erro">{erro}</div>}

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Perfil</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.email}</td>
              <td>{usuario.perfil}</td>
              <td>{usuario.ativo ? 'Sim' : 'Não'}</td>
              <td className="acoes">
                <Link to={`/editar-usuario/${usuario.id}`} className="btn-editar">
                  Editar
                </Link>
                <button onClick={() => handleExcluir(usuario.id)} className="btn-excluir">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarUsuarios;

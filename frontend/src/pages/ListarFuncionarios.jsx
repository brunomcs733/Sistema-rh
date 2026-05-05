import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/funcionarios');
      setFuncionarios(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar funcionários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await api.delete(`/funcionarios/${id}`);
        carregarFuncionarios();
      } catch (error) {
        alert('Erro ao excluir funcionário');
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
      <Link to="/cadastro-funcionario" className="btn-novo">
        + Novo Funcionário
      </Link>
    </div>

    <h1>Lista de Funcionários</h1>
    
    {erro && <div className="erro">{erro}</div>}
      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Cargo</th>
            <th>Data Admissão</th>
            <th>Cliente ID</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map(funcionario => (
            <tr key={funcionario.id}>
              <td>{funcionario.id}</td>
              <td>{funcionario.nome}</td>
              <td>{funcionario.cpf}</td>
              <td>{funcionario.cargo || '-'}</td>
              <td>{funcionario.data_admissao || '-'}</td>
              <td>{funcionario.cliente_id}</td>
              <td>{funcionario.ativo ? 'Sim' : 'Não'}</td>
              <td className="acoes">
                <Link to={`/editar-funcionario/${funcionario.id}`} className="btn-editar">
                  Editar
                </Link>
                <button onClick={() => handleExcluir(funcionario.id)} className="btn-excluir">
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

export default ListarFuncionarios;

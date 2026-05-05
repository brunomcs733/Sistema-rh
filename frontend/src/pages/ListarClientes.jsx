import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clientes');
      setClientes(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        carregarClientes();
      } catch (error) {
        alert('Erro ao excluir cliente');
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
      <Link to="/cadastro-cliente" className="btn-novo">
        + Novo Cliente
      </Link>
    </div>

    <h1>Lista de Clientes</h1>
    
    {erro && <div className="erro">{erro}</div>}

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>CNPJ</th>
            <th>Razão Social</th>
            <th>Nome Fantasia</th>
            <th>Contato</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.cnpj}</td>
              <td>{cliente.razao_social}</td>
              <td>{cliente.nome_fantasia || '-'}</td>
              <td>{cliente.contato || '-'}</td>
              <td>{cliente.ativo ? 'Sim' : 'Não'}</td>
              <td className="acoes">
                <Link to={`/editar-cliente/${cliente.id}`} className="btn-editar">
                  Editar
                </Link>
                <button onClick={() => handleExcluir(cliente.id)} className="btn-excluir">
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

export default ListarClientes;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarEnderecos() {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/enderecos');
      setEnderecos(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar solicitações de endereço');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pendente': '⏳ Pendente',
      'aprovado': '✅ Aprovado',
      'rejeitado': '❌ Rejeitado'
    };
    return statusMap[status] || status;
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
      try {
        await api.delete(`/enderecos/${id}`);
        carregarEnderecos();
      } catch (error) {
        alert('Erro ao excluir solicitação');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="listar-container">
      <h1>Solicitações de Alteração de Endereço</h1>
      
      {erro && <div className="erro">{erro}</div>}
      
      <Link to="/cadastro-endereco" className="btn-novo">
        + Nova Solicitação
      </Link>

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Logradouro</th>
            <th>Número</th>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>Status</th>
            <th>Funcionário ID</th>
            <th>Data Solicitação</th>
            <th>Ações</th>
           </tr>
        </thead>
        <tbody>
          {enderecos.map(endereco => (
            <tr key={endereco.id}>
              <td>{endereco.id}</td>
              <td>{endereco.logradouro}</td>
              <td>{endereco.numero}</td>
              <td>{endereco.bairro}</td>
              <td>{endereco.cidade}</td>
              <td className={`status-${endereco.status}`}>
                {getStatusLabel(endereco.status)}
              </td>
              <td>{endereco.funcionario_id}</td>
              <td>{endereco.data_solicitacao}</td>
              <td className="acoes">
                <Link to={`/editar-endereco/${endereco.id}`} className="btn-editar">
                  Editar
                </Link>
                <button onClick={() => handleExcluir(endereco.id)} className="btn-excluir">
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

export default ListarEnderecos;

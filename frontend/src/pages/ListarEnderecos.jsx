import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarEnderecos() {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await api.get('/enderecos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEnderecos(response.data);
      setErro('');
    } catch (error) {
      console.error('Erro detalhado:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
      } else {
        setErro('Erro ao carregar solicitações de endereço');
      }
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
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await api.delete(`/enderecos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.sucesso) {
          // Recarregar a lista após exclusão
          carregarEnderecos();
        } else {
          alert(response.data.erro || 'Erro ao excluir solicitação');
        }
      } catch (error) {
        console.error('Erro na exclusão:', error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login');
        } else if (error.response?.data?.erro) {
          alert(error.response.data.erro);
        } else if (error.request) {
          alert('Erro de conexão com o servidor');
        } else {
          alert('Erro ao excluir solicitação');
        }
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

      {enderecos.length === 0 ? (
        <div className="sem-registros">Nenhuma solicitação encontrada.</div>
      ) : (
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
                <td>{endereco.data_solicitacao?.split('T')[0] || endereco.data_solicitacao}</td>
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
      )}
    </div>
  );
}

export default ListarEnderecos;

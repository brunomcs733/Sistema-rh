import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarVagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarVagas();
  }, []);

  const carregarVagas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vagas');
      setVagas(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar vagas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      try {
        await api.delete(`/vagas/${id}`);
        carregarVagas();
      } catch (error) {
        alert('Erro ao excluir vaga');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="listar-container">
      <h1>Lista de Vagas</h1>
      
      {erro && <div className="erro">{erro}</div>}
      
      <Link to="/cadastro-vaga" className="btn-novo">
        + Nova Vaga
      </Link>

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Salário</th>
            <th>Data Abertura</th>
            <th>Data Encerramento</th>
            <th>Cliente ID</th>
            <th>Ativa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vagas.map(vaga => (
            <tr key={vaga.id}>
              <td>{vaga.id}</td>
              <td>{vaga.titulo}</td>
              <td className="descricao-cell">{vaga.descricao?.substring(0, 50)}...</td>
              <td>{vaga.salario ? `R$ ${vaga.salario}` : '-'}</td>
              <td>{vaga.data_abertura}</td>
              <td>{vaga.data_encerramento || '-'}</td>
              <td>{vaga.cliente_id}</td>
              <td>{vaga.ativa ? 'Sim' : 'Não'}</td>
              <td className="acoes">
                <Link to={`/editar-vaga/${vaga.id}`} className="btn-editar">
                  Editar
                </Link>
                <button onClick={() => handleExcluir(vaga.id)} className="btn-excluir">
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

export default ListarVagas;

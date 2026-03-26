import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Listar.css';

function ListarCandidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarCandidatos();
  }, []);

  const carregarCandidatos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/candidatos');
      setCandidatos(response.data);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar candidatos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este candidato?')) {
      try {
        await api.delete(`/candidatos/${id}`);
        carregarCandidatos();
      } catch (error) {
        alert('Erro ao excluir candidato');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="listar-container">
      <h1>Lista de Candidatos</h1>
      
      {erro && <div className="erro">{erro}</div>}
      
      <Link to="/cadastro-candidato" className="btn-novo">
        + Novo Candidato
      </Link>

      <table className="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {candidatos.map(candidato => (
            <tr key={candidato.id}>
              <td>{candidato.id}</td>
              <td>{candidato.nome}</td>
              <td>{candidato.cpf}</td>
              <td>{candidato.email}</td>
              <td>{candidato.telefone || '-'}</td>
              <td>{candidato.ativo ? 'Sim' : 'Não'}</td>
              <td className="acoes">
                <Link to={`/editar-candidato/${candidato.id}`} className="btn-editar">
                  Editar
                </Link>
                <button onClick={() => handleExcluir(candidato.id)} className="btn-excluir">
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

export default ListarCandidatos;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Cadastro.css';

function CadastroCandidatura() {
  const [formData, setFormData] = useState({
    vaga_id: '',
    candidato_id: ''
  });
  const [vagas, setVagas] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // Buscar vagas ativas
  useEffect(() => {
    const buscarVagas = async () => {
      try {
        const response = await api.get('/vagas');
        setVagas(response.data);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };
    buscarVagas();
  }, []);

  // Buscar candidatos ativos
  useEffect(() => {
    const buscarCandidatos = async () => {
      try {
        const response = await api.get('/candidatos');
        setCandidatos(response.data);
      } catch (error) {
        console.error('Erro ao buscar candidatos:', error);
      }
    };
    buscarCandidatos();
  }, []);

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
      vaga_id: parseInt(formData.vaga_id),
      candidato_id: parseInt(formData.candidato_id)
    };

    try {
      const response = await api.post('/candidaturas', dadosParaEnviar);
      setMensagem(response.data.mensagem);
      setFormData({
        vaga_id: '',
        candidato_id: ''
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
      <h1>Cadastro de Candidatura</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vaga:</label>
          <select
            name="vaga_id"
            value={formData.vaga_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma vaga</option>
            {vagas.map(vaga => (
              <option key={vaga.id} value={vaga.id}>
                {vaga.titulo} (ID: {vaga.id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Candidato:</label>
          <select
            name="candidato_id"
            value={formData.candidato_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um candidato</option>
            {candidatos.map(candidato => (
              <option key={candidato.id} value={candidato.id}>
                {candidato.nome} - {candidato.email}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Registrar Candidatura</button>
      </form>
    </div>
  );
}


export default CadastroCandidatura;

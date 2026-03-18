import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Cadastro.css';

function CadastroEndereco() {
  const [formData, setFormData] = useState({
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    funcionario_id: '',
    comprovante: '',
    comprovante_nome: '',
    comprovante_tipo: ''
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [arquivo, setArquivo] = useState(null);

  // Buscar funcionários ativos
  useEffect(() => {
    const buscarFuncionarios = async () => {
      try {
        const response = await api.get('/funcionarios');
        setFuncionarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      }
    };
    buscarFuncionarios();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setArquivo(file);
    
    // Converter para base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      setFormData({
        ...formData,
        comprovante: base64,
        comprovante_nome: file.name,
        comprovante_tipo: file.type
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    const dadosParaEnviar = {
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep,
      funcionario_id: parseInt(formData.funcionario_id),
      comprovante: formData.comprovante,
      comprovante_nome: formData.comprovante_nome,
      comprovante_tipo: formData.comprovante_tipo
    };

    try {
      const response = await api.post('/enderecos/solicitar', dadosParaEnviar);
      setMensagem(response.data.mensagem);
      setFormData({
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        funcionario_id: '',
        comprovante: '',
        comprovante_nome: '',
        comprovante_tipo: ''
      });
      setArquivo(null);
      // Limpar input file
      document.getElementById('comprovante').value = '';
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
      <h1>Solicitar Alteração de Endereço</h1>
      
      {mensagem && <div className="sucesso">{mensagem}</div>}
      {erro && <div className="erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Funcionário:</label>
          <select
            name="funcionario_id"
            value={formData.funcionario_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um funcionário</option>
            {funcionarios.map(func => (
              <option key={func.id} value={func.id}>
                {func.nome} (ID: {func.id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Logradouro (Rua, Av, etc):</label>
          <input
            type="text"
            name="logradouro"
            value={formData.logradouro}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Número:</label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Complemento:</label>
          <input
            type="text"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bairro:</label>
          <input
            type="text"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Estado (UF):</label>
          <input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            maxLength="2"
            required
          />
        </div>

        <div className="form-group">
          <label>CEP (apenas números):</label>
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            maxLength="8"
            required
          />
        </div>

        <div className="form-group">
          <label>Comprovante de Residência (PDF/Imagem):</label>
          <input
            type="file"
            id="comprovante"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
          {arquivo && <small>Arquivo: {arquivo.name}</small>}
        </div>

        <button type="submit">Solicitar Alteração</button>
      </form>
    </div>
  );
}

export default CadastroEndereco;

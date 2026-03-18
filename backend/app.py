from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.auth_controller import cadastrar_usuario
from database.connection import test_connection
from controllers.cliente_controller import cadastrar_cliente
from controllers.funcionario_controller import cadastrar_funcionario
from controllers.vaga_controller import cadastrar_vaga
from controllers.candidato_controller import cadastrar_candidato
from controllers.candidatura_controller import cadastrar_candidatura
from controllers.endereco_controller import solicitar_alteracao_endereco

# Listas de cliente, vagas e candidatos
from controllers.cliente_controller import listar_clientes
from controllers.vaga_controller import listar_vagas
from controllers.candidato_controller import listar_candidatos
from controllers.funcionario_controller import listar_funcionarios


load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    status, msg = test_connection()
    return jsonify({'status': 'ok', 'banco': msg})

app.route('/api/usuarios', methods=['POST'])(cadastrar_usuario)
app.route('/api/clientes', methods=['POST'])(cadastrar_cliente)
app.route('/api/funcionarios', methods=['POST'])(cadastrar_funcionario)
app.route('/api/vagas', methods=['POST'])(cadastrar_vaga)
app.route('/api/candidatos', methods=['POST'])(cadastrar_candidato)
app.route('/api/candidaturas', methods=['POST'])(cadastrar_candidatura)
app.route('/api/enderecos/solicitar', methods=['POST'])(solicitar_alteracao_endereco)

# Rotas de listagem
app.route('/api/clientes', methods=['GET'])(listar_clientes)
app.route('/api/vagas', methods=['GET'])(listar_vagas)
app.route('/api/candidatos', methods=['GET'])(listar_candidatos)
app.route('/api/funcionarios', methods=['GET'])(listar_funcionarios)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

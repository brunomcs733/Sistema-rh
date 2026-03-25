from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ==================== IMPORTS CADASTRO ====================
from controllers.auth_controller import cadastrar_usuario
from database.connection import test_connection
from controllers.cliente_controller import cadastrar_cliente
from controllers.funcionario_controller import cadastrar_funcionario
from controllers.vaga_controller import cadastrar_vaga
from controllers.candidato_controller import cadastrar_candidato
from controllers.candidatura_controller import cadastrar_candidatura
from controllers.endereco_controller import solicitar_alteracao_endereco

# ==================== IMPORTS LISTAGEM (GET - todos) ====================
from controllers.auth_controller import listar_usuarios
from controllers.cliente_controller import listar_clientes
from controllers.funcionario_controller import listar_funcionarios
from controllers.vaga_controller import listar_vagas
from controllers.candidato_controller import listar_candidatos
from controllers.candidatura_controller import listar_candidaturas
from controllers.endereco_controller import listar_enderecos

# ==================== IMPORTS BUSCA POR ID (GET - um) ====================
from controllers.auth_controller import buscar_usuario
from controllers.cliente_controller import buscar_cliente
from controllers.funcionario_controller import buscar_funcionario
from controllers.vaga_controller import buscar_vaga
from controllers.candidato_controller import buscar_candidato
from controllers.candidatura_controller import buscar_candidatura
from controllers.endereco_controller import buscar_endereco

# ==================== IMPORTS EDIÇÃO (PUT) ====================
from controllers.auth_controller import editar_usuario
from controllers.cliente_controller import editar_cliente
from controllers.funcionario_controller import editar_funcionario
from controllers.vaga_controller import editar_vaga
from controllers.candidato_controller import editar_candidato
from controllers.candidatura_controller import editar_candidatura
from controllers.endereco_controller import editar_endereco


load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route('/health', methods=['GET'])
def health():
    status, msg = test_connection()
    return jsonify({'status': 'ok', 'banco': msg})


# ==================== ROTAS DE CADASTRO (POST) ====================
app.route('/api/usuarios', methods=['POST'])(cadastrar_usuario)
app.route('/api/clientes', methods=['POST'])(cadastrar_cliente)
app.route('/api/funcionarios', methods=['POST'])(cadastrar_funcionario)
app.route('/api/vagas', methods=['POST'])(cadastrar_vaga)
app.route('/api/candidatos', methods=['POST'])(cadastrar_candidato)
app.route('/api/candidaturas', methods=['POST'])(cadastrar_candidatura)
app.route('/api/enderecos/solicitar', methods=['POST'])(solicitar_alteracao_endereco)


# ==================== ROTAS DE LISTAGEM (GET - todos) ====================
app.route('/api/usuarios', methods=['GET'])(listar_usuarios)
app.route('/api/clientes', methods=['GET'])(listar_clientes)
app.route('/api/funcionarios', methods=['GET'])(listar_funcionarios)
app.route('/api/vagas', methods=['GET'])(listar_vagas)
app.route('/api/candidatos', methods=['GET'])(listar_candidatos)
app.route('/api/candidaturas', methods=['GET'])(listar_candidaturas)
app.route('/api/enderecos', methods=['GET'])(listar_enderecos)


# ==================== ROTAS DE BUSCA POR ID (GET - um) ====================
@app.route('/api/usuarios/<int:id>', methods=['GET'])
def buscar_usuario_route(id):
    return buscar_usuario(id)

@app.route('/api/clientes/<int:id>', methods=['GET'])
def buscar_cliente_route(id):
    return buscar_cliente(id)

@app.route('/api/funcionarios/<int:id>', methods=['GET'])
def buscar_funcionario_route(id):
    return buscar_funcionario(id)

@app.route('/api/vagas/<int:id>', methods=['GET'])
def buscar_vaga_route(id):
    return buscar_vaga(id)

@app.route('/api/candidatos/<int:id>', methods=['GET'])
def buscar_candidato_route(id):
    return buscar_candidato(id)

@app.route('/api/candidaturas/<int:id>', methods=['GET'])
def buscar_candidatura_route(id):
    return buscar_candidatura(id)

@app.route('/api/enderecos/<int:id>', methods=['GET'])
def buscar_endereco_route(id):
    return buscar_endereco(id)


# ==================== ROTAS DE EDIÇÃO (PUT) ====================
@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def editar_usuario_route(id):
    return editar_usuario(id)

@app.route('/api/clientes/<int:id>', methods=['PUT'])
def editar_cliente_route(id):
    return editar_cliente(id)

@app.route('/api/funcionarios/<int:id>', methods=['PUT'])
def editar_funcionario_route(id):
    return editar_funcionario(id)

@app.route('/api/vagas/<int:id>', methods=['PUT'])
def editar_vaga_route(id):
    return editar_vaga(id)

@app.route('/api/candidatos/<int:id>', methods=['PUT'])
def editar_candidato_route(id):
    return editar_candidato(id)

@app.route('/api/candidaturas/<int:id>', methods=['PUT'])
def editar_candidatura_route(id):
    return editar_candidatura(id)

@app.route('/api/enderecos/<int:id>', methods=['PUT'])
def editar_endereco_route(id):
    return editar_endereco(id)


if __name__ == '__main__':
    app.run(debug=True, port=5000)


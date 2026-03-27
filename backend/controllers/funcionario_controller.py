from flask import request, jsonify
import psycopg2
from database.connection import get_connection
from models.funcionario import Funcionario


# ==================== FUNÇÃO CADASTRAR ====================
def cadastrar_funcionario():
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Corpo da requisição vazio'}), 400
        
        # Extrair campos
        nome = dados.get('nome')
        cpf = dados.get('cpf')
        cargo = dados.get('cargo')
        data_admissao = dados.get('data_admissao')
        cliente_id = dados.get('cliente_id')
        usuario_id = dados.get('usuario_id')  # Opcional
        
        # Validações
        if not nome:
            return jsonify({'erro': 'Nome é obrigatório'}), 400
        if not cpf:
            return jsonify({'erro': 'CPF é obrigatório'}), 400
        if not cliente_id:
            return jsonify({'erro': 'ID do cliente é obrigatório'}), 400
        
        # Validar CPF (apenas números, 11 dígitos)
        cpf_limpo = ''.join(filter(str.isdigit, cpf))
        if len(cpf_limpo) != 11:
            return jsonify({'erro': 'CPF deve ter 11 dígitos'}), 400
        
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO funcionario (nome, cpf, cargo, data_admissao, 
                                    ativo, excluido, cliente_id, usuario_id)
            VALUES (%s, %s, %s, %s, true, false, %s, %s)
            RETURNING id, nome, cpf, cargo, data_admissao, ativo, cliente_id, usuario_id
        """, (nome, cpf_limpo, cargo, data_admissao, cliente_id, usuario_id))
        
        func_data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not func_data:
            return jsonify({'erro': 'Erro ao criar funcionário'}), 500
        
        funcionario = {
            'id': func_data[0],
            'nome': func_data[1],
            'cpf': func_data[2],
            'cargo': func_data[3],
            'data_admissao': str(func_data[4]) if func_data[4] else None,
            'ativo': func_data[5],
            'cliente_id': func_data[6],
            'usuario_id': func_data[7]
        }
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Funcionário cadastrado com sucesso!',
            'funcionario': funcionario
        }), 201
        
    except psycopg2.IntegrityError as e:
        if 'unique constraint' in str(e) and 'cpf' in str(e):
            return jsonify({'erro': 'Este CPF já está cadastrado'}), 409
        if 'foreign key' in str(e) and 'cliente_id' in str(e):
            return jsonify({'erro': 'Cliente não encontrado'}), 400
        return jsonify({'erro': f'Erro de integridade: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO LISTAR TODOS ====================
def listar_funcionarios():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, nome, cpf, cargo, data_admissao, ativo, cliente_id, usuario_id
            FROM funcionario 
            WHERE excluido = false AND ativo = true
            ORDER BY nome
        """)
        
        funcionarios = cur.fetchall()
        cur.close()
        conn.close()
        
        resultado = []
        for f in funcionarios:
            resultado.append({
                'id': f[0],
                'nome': f[1],
                'cpf': f[2],
                'cargo': f[3],
                'data_admissao': str(f[4]) if f[4] else None,
                'ativo': f[5],
                'cliente_id': f[6],
                'usuario_id': f[7]
            })
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO BUSCAR POR ID ====================
def buscar_funcionario(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, nome, cpf, cargo, data_admissao, ativo, cliente_id, usuario_id
            FROM funcionario 
            WHERE id = %s AND excluido = false
        """, (id,))
        
        funcionario = cur.fetchone()
        cur.close()
        conn.close()
        
        if not funcionario:
            return jsonify({'erro': 'Funcionário não encontrado'}), 404
        
        return jsonify({
            'id': funcionario[0],
            'nome': funcionario[1],
            'cpf': funcionario[2],
            'cargo': funcionario[3],
            'data_admissao': str(funcionario[4]) if funcionario[4] else None,
            'ativo': funcionario[5],
            'cliente_id': funcionario[6],
            'usuario_id': funcionario[7]
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO EDITAR ====================
def editar_funcionario(id):
    try:
        dados = request.get_json()
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o funcionário existe
        cur.execute("SELECT id FROM funcionario WHERE id = %s AND excluido = false", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Funcionário não encontrado'}), 404
        
        # Atualizar campos
        campos = []
        valores = []
        
        if 'nome' in dados:
            campos.append("nome = %s")
            valores.append(dados['nome'])
        if 'cpf' in dados:
            campos.append("cpf = %s")
            valores.append(dados['cpf'])
        if 'cargo' in dados:
            campos.append("cargo = %s")
            valores.append(dados['cargo'])
        if 'data_admissao' in dados:
            campos.append("data_admissao = %s")
            valores.append(dados['data_admissao'])
        if 'cliente_id' in dados:
            campos.append("cliente_id = %s")
            valores.append(dados['cliente_id'])
        if 'usuario_id' in dados:
            campos.append("usuario_id = %s")
            valores.append(dados['usuario_id'])
        
        if campos:
            campos.append("data_alteracao = now()")
            valores.append(id)
            query = f"UPDATE funcionario SET {', '.join(campos)} WHERE id = %s"
            cur.execute(query, valores)
            conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Funcionário atualizado com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# ==================== FUNÇÃO EXCLUIR ====================
def excluir_funcionario(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o funcionário existe e não está excluído
        cur.execute("SELECT id FROM funcionario WHERE id = %s AND excluido = false", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Funcionário não encontrado'}), 404
        
        # Exclusão lógica (marcar como excluído)
        cur.execute("""
            UPDATE funcionario 
            SET excluido = true, data_alteracao = now() 
            WHERE id = %s
        """, (id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Funcionário excluído com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
# ==================== FUNÇÃO ATIVAR/DESATIVAR ====================
def alternar_status_funcionario(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o funcionário existe e não está excluído
        cur.execute("SELECT id, ativo FROM funcionario WHERE id = %s AND excluido = false", (id,))
        funcionario = cur.fetchone()
        if not funcionario:
            return jsonify({'erro': 'Funcionário não encontrado'}), 404
        
        # Alternar status
        novo_status = not funcionario[1]
        cur.execute("""
            UPDATE funcionario 
            SET ativo = %s, data_alteracao = now() 
            WHERE id = %s
        """, (novo_status, id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        status_texto = 'ativado' if novo_status else 'desativado'
        return jsonify({
            'sucesso': True,
            'mensagem': f'Funcionário {status_texto} com sucesso!',
            'ativo': novo_status
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    

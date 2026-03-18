from flask import request, jsonify
import psycopg2
from database.connection import get_connection
from models.funcionario import Funcionario

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
    
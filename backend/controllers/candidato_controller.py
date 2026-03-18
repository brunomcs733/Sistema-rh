from flask import request, jsonify
import psycopg2
import base64
from database.connection import get_connection
from models.candidato import Candidato

def cadastrar_candidato():
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Corpo da requisição vazio'}), 400
        
        nome = dados.get('nome')
        cpf = dados.get('cpf')
        email = dados.get('email')
        telefone = dados.get('telefone')
        curriculo_base64 = dados.get('curriculo')
        curriculo_nome = dados.get('curriculo_nome')
        curriculo_tipo = dados.get('curriculo_tipo')
        usuario_id = dados.get('usuario_id')
        
        if not nome or not cpf or not email:
            return jsonify({'erro': 'Nome, CPF e email são obrigatórios'}), 400
        
        cpf_limpo = ''.join(filter(str.isdigit, cpf))
        if len(cpf_limpo) != 11:
            return jsonify({'erro': 'CPF deve ter 11 dígitos'}), 400
        
        if '@' not in email or '.' not in email:
            return jsonify({'erro': 'Email inválido'}), 400
        
        # Decodificar currículo se enviado
        curriculo_bytes = None
        if curriculo_base64:
            try:
                curriculo_bytes = base64.b64decode(curriculo_base64)
            except:
                return jsonify({'erro': 'Currículo em formato inválido'}), 400
        
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO candidato (nome, cpf, email, telefone, curriculo,
                                 curriculo_nome, curriculo_tipo, ativo, excluido, usuario_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, true, false, %s)
            RETURNING id, nome, cpf, email, telefone, curriculo_nome, curriculo_tipo, ativo, usuario_id
        """, (nome, cpf_limpo, email, telefone, curriculo_bytes, 
              curriculo_nome, curriculo_tipo, usuario_id))
        
        cand_data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not cand_data:
            return jsonify({'erro': 'Erro ao criar candidato'}), 500
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Candidato cadastrado com sucesso!',
            'candidato': {
                'id': cand_data[0],
                'nome': cand_data[1],
                'cpf': cand_data[2],
                'email': cand_data[3],
                'telefone': cand_data[4],
                'curriculo_nome': cand_data[5],
                'curriculo_tipo': cand_data[6],
                'ativo': cand_data[7],
                'usuario_id': cand_data[8]
            }
        }), 201
        
    except psycopg2.IntegrityError as e:
        if 'unique constraint' in str(e):
            if 'cpf' in str(e):
                return jsonify({'erro': 'Este CPF já está cadastrado'}), 409
            if 'email' in str(e):
                return jsonify({'erro': 'Este email já está cadastrado'}), 409
        return jsonify({'erro': f'Erro de integridade: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
def listar_candidatos():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, nome, cpf, email, telefone, ativo, usuario_id
            FROM candidato 
            WHERE excluido = false
            ORDER BY nome
        """)
        
        candidatos = cur.fetchall()
        cur.close()
        conn.close()
        
        resultado = []
        for c in candidatos:
            resultado.append({
                'id': c[0],
                'nome': c[1],
                'cpf': c[2],
                'email': c[3],
                'telefone': c[4],
                'ativo': c[5],
                'usuario_id': c[6]
            })
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
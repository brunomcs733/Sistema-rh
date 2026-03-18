from flask import request, jsonify
import psycopg2
from database.connection import get_connection
from models.candidatura import Candidatura

def cadastrar_candidatura():
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Corpo da requisição vazio'}), 400
        
        vaga_id = dados.get('vaga_id')
        candidato_id = dados.get('candidato_id')
        
        if not vaga_id or not candidato_id:
            return jsonify({'erro': 'vaga_id e candidato_id são obrigatórios'}), 400
        
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO candidatura (vaga_id, candidato_id, status, excluido)
            VALUES (%s, %s, 'pendente', false)
            RETURNING id, data_candidatura, status, vaga_id, candidato_id
        """, (vaga_id, candidato_id))
        
        cand_data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not cand_data:
            return jsonify({'erro': 'Erro ao criar candidatura'}), 500
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Candidatura realizada com sucesso!',
            'candidatura': {
                'id': cand_data[0],
                'data_candidatura': str(cand_data[1]),
                'status': cand_data[2],
                'vaga_id': cand_data[3],
                'candidato_id': cand_data[4]
            }
        }), 201
        
    except psycopg2.IntegrityError as e:
        if 'unique constraint' in str(e):
            return jsonify({'erro': 'Candidato já se candidatou a esta vaga'}), 409
        if 'foreign key' in str(e):
            if 'vaga_id' in str(e):
                return jsonify({'erro': 'Vaga não encontrada'}), 400
            if 'candidato_id' in str(e):
                return jsonify({'erro': 'Candidato não encontrado'}), 400
        return jsonify({'erro': f'Erro de integridade: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
from flask import request, jsonify
import psycopg2
from database.connection import get_connection
from models.candidatura import Candidatura


# ==================== FUNÇÃO CADASTRAR ====================
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


# ==================== FUNÇÃO LISTAR TODOS ====================
def listar_candidaturas():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                cand.id,
                cand.data_candidatura,
                cand.status,
                cand.vaga_id,
                v.titulo,
                cand.candidato_id,
                c.nome,
                cl.razao_social
            FROM candidatura cand
            INNER JOIN vaga v ON v.id = cand.vaga_id
            INNER JOIN candidato c ON c.id = cand.candidato_id
            INNER JOIN cliente cl ON cl.id = v.cliente_id
            WHERE cand.excluido = false
            ORDER BY cand.data_candidatura DESC
        """)
        
        candidaturas = cur.fetchall()
        cur.close()
        conn.close()
        
        from models.candidatura_lista import CandidaturaLista
        
        resultado = []
        for c in candidaturas:
            candidatura_lista = CandidaturaLista(
                id=c[0],
                data_candidatura=c[1],
                status=c[2],
                vaga_id=c[3],
                titulo=c[4],
                candidato_id=c[5],
                nome=c[6],
                razao_social=c[7]
            )
            resultado.append(candidatura_lista.to_dict())
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO BUSCAR POR ID ====================
def buscar_candidatura(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, data_candidatura, status, vaga_id, candidato_id
            FROM candidatura 
            WHERE id = %s AND excluido = false
        """, (id,))
        
        candidatura = cur.fetchone()
        cur.close()
        conn.close()
        
        if not candidatura:
            return jsonify({'erro': 'Candidatura não encontrada'}), 404
        
        return jsonify({
            'id': candidatura[0],
            'data_candidatura': str(candidatura[1]) if candidatura[1] else None,
            'status': candidatura[2],
            'vaga_id': candidatura[3],
            'candidato_id': candidatura[4]
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO EDITAR ====================
def editar_candidatura(id):
    try:
        dados = request.get_json()
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se a candidatura existe
        cur.execute("SELECT id FROM candidatura WHERE id = %s AND excluido = false", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Candidatura não encontrada'}), 404
        
        # Atualizar status (principal campo editável)
        campos = []
        valores = []
        
        if 'status' in dados:
            campos.append("status = %s")
            valores.append(dados['status'])
        
        if campos:
            campos.append("data_alteracao = now()")
            valores.append(id)
            query = f"UPDATE candidatura SET {', '.join(campos)} WHERE id = %s"
            cur.execute(query, valores)
            conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Candidatura atualizada com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


from flask import request, jsonify
import psycopg2
from database.connection import get_connection
from models.vaga import Vaga

def cadastrar_vaga():
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Corpo da requisição vazio'}), 400
        
        titulo = dados.get('titulo')
        descricao = dados.get('descricao')
        requisitos = dados.get('requisitos')
        salario = dados.get('salario')
        data_encerramento = dados.get('data_encerramento')
        cliente_id = dados.get('cliente_id')
        
        # Validações
        if not titulo:
            return jsonify({'erro': 'Título é obrigatório'}), 400
        if not descricao:
            return jsonify({'erro': 'Descrição é obrigatória'}), 400
        if not cliente_id:
            return jsonify({'erro': 'ID do cliente é obrigatório'}), 400
        
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO vaga (titulo, descricao, requisitos, salario, 
                            data_abertura, data_encerramento, ativa, excluido, cliente_id)
            VALUES (%s, %s, %s, %s, CURRENT_DATE, %s, true, false, %s)
            RETURNING id, titulo, descricao, requisitos, salario, 
                      data_abertura, data_encerramento, ativa, cliente_id
        """, (titulo, descricao, requisitos, salario, data_encerramento, cliente_id))
        
        vaga_data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not vaga_data:
            return jsonify({'erro': 'Erro ao criar vaga'}), 500
        
        vaga = {
            'id': vaga_data[0],
            'titulo': vaga_data[1],
            'descricao': vaga_data[2],
            'requisitos': vaga_data[3],
            'salario': float(vaga_data[4]) if vaga_data[4] else None,
            'data_abertura': str(vaga_data[5]),
            'data_encerramento': str(vaga_data[6]) if vaga_data[6] else None,
            'ativa': vaga_data[7],
            'cliente_id': vaga_data[8]
        }
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Vaga cadastrada com sucesso!',
            'vaga': vaga
        }), 201
        
    except psycopg2.IntegrityError as e:
        if 'foreign key' in str(e) and 'cliente_id' in str(e):
            return jsonify({'erro': 'Cliente não encontrado'}), 400
        return jsonify({'erro': f'Erro de integridade: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
def listar_vagas():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, titulo, descricao, requisitos, salario, 
                   data_abertura, data_encerramento, ativa, cliente_id
            FROM vaga 
            WHERE excluido = false AND ativa = true
            ORDER BY data_abertura DESC
        """)
        
        vagas = cur.fetchall()
        cur.close()
        conn.close()
        
        resultado = []
        for v in vagas:
            resultado.append({
                'id': v[0],
                'titulo': v[1],
                'descricao': v[2],
                'requisitos': v[3],
                'salario': float(v[4]) if v[4] else None,
                'data_abertura': str(v[5]) if v[5] else None,
                'data_encerramento': str(v[6]) if v[6] else None,
                'ativa': v[7],
                'cliente_id': v[8]
            })
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
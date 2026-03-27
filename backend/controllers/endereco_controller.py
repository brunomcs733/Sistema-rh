from flask import request, jsonify
import psycopg2
import base64
from database.connection import get_connection
from models.endereco import Endereco


# ==================== FUNÇÃO SOLICITAR ALTERAÇÃO ====================
def solicitar_alteracao_endereco():
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Corpo da requisição vazio'}), 400
        
        # Campos obrigatórios
        logradouro = dados.get('logradouro')
        numero = dados.get('numero')
        bairro = dados.get('bairro')
        cidade = dados.get('cidade')
        estado = dados.get('estado')
        cep = dados.get('cep')
        funcionario_id = dados.get('funcionario_id')
        
        # Campos opcionais
        complemento = dados.get('complemento')
        comprovante_base64 = dados.get('comprovante')
        comprovante_nome = dados.get('comprovante_nome')
        comprovante_tipo = dados.get('comprovante_tipo')
        
        # Validações
        if not all([logradouro, numero, bairro, cidade, estado, cep, funcionario_id]):
            return jsonify({'erro': 'Todos os campos obrigatórios devem ser preenchidos'}), 400
        
        if len(estado) != 2:
            return jsonify({'erro': 'Estado deve ter 2 caracteres'}), 400
        
        cep_limpo = ''.join(filter(str.isdigit, cep))
        if len(cep_limpo) != 8:
            return jsonify({'erro': 'CEP deve ter 8 dígitos'}), 400
        
        # Decodificar comprovante se enviado
        comprovante_bytes = None
        if comprovante_base64:
            try:
                comprovante_bytes = base64.b64decode(comprovante_base64)
            except:
                return jsonify({'erro': 'Comprovante em formato inválido'}), 400
        
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO endereco (logradouro, numero, complemento, bairro, cidade,
                                estado, cep, comprovante, comprovante_nome, comprovante_tipo,
                                status, funcionario_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pendente', %s)
            RETURNING id, logradouro, numero, bairro, cidade, estado, cep, 
                      comprovante_nome, status, funcionario_id, data_solicitacao
        """, (logradouro, numero, complemento, bairro, cidade, estado, cep_limpo,
              comprovante_bytes, comprovante_nome, comprovante_tipo, funcionario_id))
        
        end_data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not end_data:
            return jsonify({'erro': 'Erro ao criar solicitação'}), 500
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Solicitação de alteração de endereço enviada para aprovação',
            'endereco': {
                'id': end_data[0],
                'logradouro': end_data[1],
                'numero': end_data[2],
                'bairro': end_data[3],
                'cidade': end_data[4],
                'estado': end_data[5],
                'cep': end_data[6],
                'comprovante_nome': end_data[7],
                'status': end_data[8],
                'funcionario_id': end_data[9],
                'data_solicitacao': str(end_data[10])
            }
        }), 201
        
    except psycopg2.IntegrityError as e:
        if 'foreign key' in str(e) and 'funcionario_id' in str(e):
            return jsonify({'erro': 'Funcionário não encontrado'}), 400
        return jsonify({'erro': f'Erro de integridade: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO LISTAR TODOS ====================
def listar_enderecos():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, logradouro, numero, complemento, bairro, cidade, estado, cep,
                   status, funcionario_id, data_solicitacao
            FROM endereco 
            ORDER BY data_solicitacao DESC
        """)
        
        enderecos = cur.fetchall()
        cur.close()
        conn.close()
        
        resultado = []
        for e in enderecos:
            resultado.append({
                'id': e[0],
                'logradouro': e[1],
                'numero': e[2],
                'complemento': e[3],
                'bairro': e[4],
                'cidade': e[5],
                'estado': e[6],
                'cep': e[7],
                'status': e[8],
                'funcionario_id': e[9],
                'data_solicitacao': str(e[10]) if e[10] else None
            })
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO BUSCAR POR ID ====================
def buscar_endereco(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, logradouro, numero, complemento, bairro, cidade, estado, cep,
                   status, funcionario_id, data_solicitacao, data_aprovacao, motivo_rejeicao
            FROM endereco 
            WHERE id = %s
        """, (id,))
        
        endereco = cur.fetchone()
        cur.close()
        conn.close()
        
        if not endereco:
            return jsonify({'erro': 'Endereço não encontrado'}), 404
        
        return jsonify({
            'id': endereco[0],
            'logradouro': endereco[1],
            'numero': endereco[2],
            'complemento': endereco[3],
            'bairro': endereco[4],
            'cidade': endereco[5],
            'estado': endereco[6],
            'cep': endereco[7],
            'status': endereco[8],
            'funcionario_id': endereco[9],
            'data_solicitacao': str(endereco[10]) if endereco[10] else None,
            'data_aprovacao': str(endereco[11]) if endereco[11] else None,
            'motivo_rejeicao': endereco[12]
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO EDITAR ====================
def editar_endereco(id):
    try:
        dados = request.get_json()
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o endereço existe
        cur.execute("SELECT id FROM endereco WHERE id = %s", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Endereço não encontrado'}), 404
        
        # Atualizar campos permitidos (status e motivo_rejeicao)
        campos = []
        valores = []
        
        if 'status' in dados:
            campos.append("status = %s")
            valores.append(dados['status'])
        if 'motivo_rejeicao' in dados:
            campos.append("motivo_rejeicao = %s")
            valores.append(dados['motivo_rejeicao'])
        
        if campos:
            campos.append("data_alteracao = now()")
            valores.append(id)
            query = f"UPDATE endereco SET {', '.join(campos)} WHERE id = %s"
            cur.execute(query, valores)
            conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Endereço atualizado com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
# ==================== FUNÇÃO EXCLUIR ====================
def excluir_endereco(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se a solicitação existe
        cur.execute("SELECT id FROM endereco WHERE id = %s", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Solicitação não encontrada'}), 404
        
        # Exclusão lógica (marcar como excluído)
        cur.execute("""
            UPDATE endereco 
            SET excluido = true, data_alteracao = now() 
            WHERE id = %s
        """, (id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Solicitação excluída com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
# ==================== FUNÇÃO ATIVAR/DESATIVAR ====================
def alternar_status_endereco(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o endereço existe
        cur.execute("SELECT id, status FROM endereco WHERE id = %s", (id,))
        endereco = cur.fetchone()
        if not endereco:
            return jsonify({'erro': 'Solicitação não encontrada'}), 404
        
        # Alternar status entre pendente e aprovado
        status_atual = endereco[1]
        if status_atual == 'pendente':
            novo_status = 'aprovado'
        elif status_atual == 'aprovado':
            novo_status = 'pendente'
        else:
            return jsonify({'erro': 'Não é possível alternar status de solicitação rejeitada'}), 400
        
        cur.execute("""
            UPDATE endereco 
            SET status = %s, data_alteracao = now() 
            WHERE id = %s
        """, (novo_status, id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': f'Status da solicitação alterado para {novo_status}!',
            'status': novo_status
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
    
from flask import request, jsonify
import psycopg2
from database.connection import get_connection
from models.cliente import Cliente


# ==================== FUNÇÃO CADASTRAR ====================
def cadastrar_cliente():
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({'erro': 'Corpo da requisição vazio'}), 400
        
        # Extrair campos
        cnpj = dados.get('cnpj')
        razao_social = dados.get('razao_social')
        nome_fantasia = dados.get('nome_fantasia')
        contato = dados.get('contato')
        usuario_id = dados.get('usuario_id')  # Opcional
        
        # Validações
        if not cnpj:
            return jsonify({'erro': 'CNPJ é obrigatório'}), 400
        if not razao_social:
            return jsonify({'erro': 'Razão social é obrigatória'}), 400
        
        # Validar CNPJ (apenas números, 14 dígitos)
        cnpj_limpo = ''.join(filter(str.isdigit, cnpj))
        if len(cnpj_limpo) != 14:
            return jsonify({'erro': 'CNPJ deve ter 14 dígitos'}), 400
        
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO cliente (cnpj, razao_social, nome_fantasia, contato, 
                                ativo, excluido, usuario_id)
            VALUES (%s, %s, %s, %s, true, false, %s)
            RETURNING id, cnpj, razao_social, nome_fantasia, contato, ativo, usuario_id
        """, (cnpj_limpo, razao_social, nome_fantasia, contato, usuario_id))
        
        cliente_data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not cliente_data:
            return jsonify({'erro': 'Erro ao criar cliente'}), 500
        
        cliente = {
            'id': cliente_data[0],
            'cnpj': cliente_data[1],
            'razao_social': cliente_data[2],
            'nome_fantasia': cliente_data[3],
            'contato': cliente_data[4],
            'ativo': cliente_data[5],
            'usuario_id': cliente_data[6]
        }
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Cliente cadastrado com sucesso!',
            'cliente': cliente
        }), 201
        
    except psycopg2.IntegrityError as e:
        if 'unique constraint' in str(e) and 'cnpj' in str(e):
            return jsonify({'erro': 'Este CNPJ já está cadastrado'}), 409
        return jsonify({'erro': f'Erro de integridade: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO LISTAR TODOS ====================
def listar_clientes():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, cnpj, razao_social, nome_fantasia, contato, ativo
            FROM cliente 
            WHERE excluido = false
            ORDER BY razao_social
        """)
        
        clientes = cur.fetchall()
        cur.close()
        conn.close()
        
        # Converter para lista de dicionários
        resultado = []
        for c in clientes:
            resultado.append({
                'id': c[0],
                'cnpj': c[1],
                'razao_social': c[2],
                'nome_fantasia': c[3],
                'contato': c[4],
                'ativo': c[5]
            })
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO BUSCAR POR ID ====================
def buscar_cliente(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, cnpj, razao_social, nome_fantasia, contato, ativo, usuario_id
            FROM cliente 
            WHERE id = %s AND excluido = false
        """, (id,))
        
        cliente = cur.fetchone()
        cur.close()
        conn.close()
        
        if not cliente:
            return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        return jsonify({
            'id': cliente[0],
            'cnpj': cliente[1],
            'razao_social': cliente[2],
            'nome_fantasia': cliente[3],
            'contato': cliente[4],
            'ativo': cliente[5],
            'usuario_id': cliente[6]
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO EDITAR ====================
def editar_cliente(id):
    try:
        dados = request.get_json()
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o cliente existe
        cur.execute("SELECT id FROM cliente WHERE id = %s AND excluido = false", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        # Atualizar campos permitidos
        campos = []
        valores = []
        
        if 'cnpj' in dados:
            campos.append("cnpj = %s")
            valores.append(dados['cnpj'])
        if 'razao_social' in dados:
            campos.append("razao_social = %s")
            valores.append(dados['razao_social'])
        if 'nome_fantasia' in dados:
            campos.append("nome_fantasia = %s")
            valores.append(dados['nome_fantasia'])
        if 'contato' in dados:
            campos.append("contato = %s")
            valores.append(dados['contato'])
        if 'usuario_id' in dados:
            campos.append("usuario_id = %s")
            valores.append(dados['usuario_id'])
        
        if campos:
            campos.append("data_alteracao = now()")
            valores.append(id)
            query = f"UPDATE cliente SET {', '.join(campos)} WHERE id = %s"
            cur.execute(query, valores)
            conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Cliente atualizado com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
# ==================== FUNÇÃO EXCLUIR ====================
def excluir_cliente(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o cliente existe e não está excluído
        cur.execute("SELECT id FROM cliente WHERE id = %s AND excluido = false", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        # Exclusão lógica (marcar como excluído)
        cur.execute("""
            UPDATE cliente 
            SET excluido = true, data_alteracao = now() 
            WHERE id = %s
        """, (id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Cliente excluído com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
# ==================== FUNÇÃO ATIVAR/DESATIVAR ====================
def alternar_status_cliente(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o cliente existe e não está excluído
        cur.execute("SELECT id, ativo FROM cliente WHERE id = %s AND excluido = false", (id,))
        cliente = cur.fetchone()
        if not cliente:
            return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        # Alternar status
        novo_status = not cliente[1]
        cur.execute("""
            UPDATE cliente 
            SET ativo = %s, data_alteracao = now() 
            WHERE id = %s
        """, (novo_status, id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        status_texto = 'ativado' if novo_status else 'desativado'
        return jsonify({
            'sucesso': True,
            'mensagem': f'Cliente {status_texto} com sucesso!',
            'ativo': novo_status
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    

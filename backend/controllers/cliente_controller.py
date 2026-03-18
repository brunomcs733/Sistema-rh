from flask import request, jsonify
import psycopg2
from database.connection import get_connection
from models.cliente import Cliente

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
        
        # Registrar no log
        try:
            from controllers.log_controller import registrar_log
            registrar_log(
                entidade='cliente',
                entidade_id=cliente_data[0],
                tipo_operacao='insercao',
                usuario_id=usuario_id,
                detalhes={'cnpj': cnpj_limpo}
            )
        except:
            pass  # Log não deve interromper o cadastro
        
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
    
from flask import request, jsonify
import psycopg2
import base64
from database.connection import get_connection
from models.endereco import Endereco

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
    
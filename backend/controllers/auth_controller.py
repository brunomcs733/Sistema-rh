from flask import request, jsonify
import psycopg2
import bcrypt
from database.connection import get_connection
from models.usuario import Usuario

def cadastrar_usuario():
    try:
        dados = request.get_json()
        email = dados.get('email')
        senha = dados.get('senha')
        perfil = dados.get('perfil')
        
        # Validações
        if not email or not senha or not perfil:
            return jsonify({'erro': 'Todos os campos são obrigatórios'}), 400
        
        perfis_validos = ['rh', 'cliente', 'funcionario', 'candidato']
        if perfil not in perfis_validos:
            return jsonify({'erro': 'Perfil inválido'}), 400
        
        if '@' not in email or '.' not in email:
            return jsonify({'erro': 'Email inválido'}), 400
        
        if len(senha) < 6:
            return jsonify({'erro': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        # Hash da senha
        senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())
        senha = senha.decode('utf-8')
        
        # Inserir no banco
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO usuario (email, senha, perfil, ativo, excluido)
            VALUES (%s, %s, %s, true, false)
            RETURNING id, email, perfil, ativo, excluido
        """, (email, senha, perfil))
        
        usuario_data = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        usuario = Usuario.from_tuple(usuario_data)
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Usuário cadastrado com sucesso!',
            'usuario': usuario.to_dict()
        }), 201
        
    except psycopg2.IntegrityError:
        return jsonify({'erro': 'Este email já está cadastrado'}), 409
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
from flask import request, jsonify
import psycopg2
import bcrypt
from database.connection import get_connection
from models.usuario import Usuario


# ==================== FUNÇÃO CADASTRAR ====================
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
        
        if not usuario_data:
            return jsonify({'erro': 'Erro ao criar usuário'}), 500
        
        usuario = Usuario(
            id=usuario_data[0],
            email=usuario_data[1],
            perfil=usuario_data[2],
            ativo=usuario_data[3],
            excluido=usuario_data[4]
        )
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Usuário cadastrado com sucesso!',
            'usuario': usuario.to_dict()
        }), 201
        
    except psycopg2.IntegrityError:
        return jsonify({'erro': 'Este email já está cadastrado'}), 409
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO LISTAR TODOS ====================
def listar_usuarios():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, perfil, ativo, excluido
            FROM usuario 
            WHERE excluido = false
            ORDER BY id DESC
        """)
        
        usuarios = cur.fetchall()
        cur.close()
        conn.close()
        
        resultado = []
        for u in usuarios:
            resultado.append({
                'id': u[0],
                'email': u[1],
                'perfil': u[2],
                'ativo': u[3],
                'excluido': u[4]
            })
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO BUSCAR POR ID ====================
def buscar_usuario(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, email, perfil, ativo, excluido
            FROM usuario 
            WHERE id = %s AND excluido = false
        """, (id,))
        
        usuario = cur.fetchone()
        cur.close()
        conn.close()
        
        if not usuario:
            return jsonify({'erro': 'Usuário não encontrado'}), 404
        
        return jsonify({
            'id': usuario[0],
            'email': usuario[1],
            'perfil': usuario[2],
            'ativo': usuario[3],
            'excluido': usuario[4]
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ==================== FUNÇÃO EDITAR ====================
def editar_usuario(id):
    try:
        dados = request.get_json()
        conn = get_connection()
        cur = conn.cursor()
        
        # Verificar se o usuário existe
        cur.execute("SELECT id FROM usuario WHERE id = %s AND excluido = false", (id,))
        if not cur.fetchone():
            return jsonify({'erro': 'Usuário não encontrado'}), 404
        
        # Atualizar campos permitidos (email e perfil)
        campos = []
        valores = []
        
        if 'email' in dados:
            campos.append("email = %s")
            valores.append(dados['email'])
        if 'perfil' in dados:
            campos.append("perfil = %s")
            valores.append(dados['perfil'])
        
        if campos:
            campos.append("data_alteracao = now()")
            valores.append(id)
            query = f"UPDATE usuario SET {', '.join(campos)} WHERE id = %s"
            cur.execute(query, valores)
            conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Usuário atualizado com sucesso!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


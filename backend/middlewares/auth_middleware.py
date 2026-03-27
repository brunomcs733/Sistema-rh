import jwt
from functools import wraps
from flask import request, jsonify
import os


def token_required(f):
    """
    Middleware para verificar token JWT em rotas protegidas.
    Uso: @token_required
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'erro': 'Token não fornecido'}), 401
        
        try:
            # Remover "Bearer " do token se presente
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            # Decodificar token
            secret_key = os.getenv('SECRET_KEY', 'chave_secreta')
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            # Adicionar dados do usuário à requisição
            request.usuario = data
            
        except jwt.ExpiredSignatureError:
            return jsonify({'erro': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'erro': 'Token inválido'}), 401
        except Exception as e:
            return jsonify({'erro': f'Erro de autenticação: {str(e)}'}), 401
        
        return f(*args, **kwargs)
    
    return decorated


def perfil_required(perfis_permitidos):
    """
    Middleware para verificar se o usuário tem perfil autorizado.
    Uso: @perfil_required(['rh', 'cliente'])
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # Verificar se o usuário está na requisição (token já validado)
            if not hasattr(request, 'usuario'):
                return jsonify({'erro': 'Usuário não autenticado'}), 401
            
            perfil_usuario = request.usuario.get('perfil')
            
            if perfil_usuario not in perfis_permitidos:
                return jsonify({
                    'erro': 'Acesso negado. Perfil não autorizado.',
                    'perfil_necessario': perfis_permitidos,
                    'seu_perfil': perfil_usuario
                }), 403
            
            return f(*args, **kwargs)
        
        return decorated
    return decorator


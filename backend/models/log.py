import json
from database.connection import get_connection

def registrar_log(entidade, entidade_id, tipo_operacao, usuario_id=None, 
                  campo_alterado=None, valor_anterior=None, valor_novo=None, detalhes=None):
    """
    Função para registrar logs de alterações
    """
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        detalhes_json = json.dumps(detalhes) if detalhes else None
        
        cur.execute("""
            INSERT INTO alteracao_log 
            (entidade, entidade_id, campo_alterado, valor_anterior, valor_novo,
             usuario_id, tipo_operacao, detalhes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (entidade, entidade_id, campo_alterado, valor_anterior, valor_novo,
              usuario_id, tipo_operacao, detalhes_json))
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro ao registrar log: {e}")
        return False
    
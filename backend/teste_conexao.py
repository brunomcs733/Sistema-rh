from database.connection import test_connection

status, mensagem = test_connection()
print("=" * 50)
print("TESTE DE CONEXÃO COM O BANCO")
print("=" * 50)
print(f"Status: {'✅ OK' if status else '❌ ERRO'}")
print(f"Mensagem: {mensagem}")

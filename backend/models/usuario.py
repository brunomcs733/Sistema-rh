class Usuario:
    def __init__(self, id=None, email=None, senha=None, perfil=None, 
                 ativo=True, excluido=False):
        self.id = id
        self.email = email
        self.senha = senha
        self.perfil = perfil
        self.ativo = ativo
        self.excluido = excluido
    
    @staticmethod
    def from_tuple(dados):
        if not dados:
            return None
        return Usuario(
            id=dados[0],
            email=dados[1],
            senha=dados[2],
            perfil=dados[3],
            ativo=dados[4],
            excluido=dados[5]
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'perfil': self.perfil,
            'ativo': self.ativo
        }
    
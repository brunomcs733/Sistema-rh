class Candidato:
    def __init__(self, id=None, nome=None, cpf=None, email=None, telefone=None,
                 curriculo=None, curriculo_nome=None, curriculo_tipo=None,
                 ativo=True, excluido=False, usuario_id=None):
        self.id = id
        self.nome = nome
        self.cpf = cpf
        self.email = email
        self.telefone = telefone
        self.curriculo = curriculo
        self.curriculo_nome = curriculo_nome
        self.curriculo_tipo = curriculo_tipo
        self.ativo = ativo
        self.excluido = excluido
        self.usuario_id = usuario_id
    
    @staticmethod
    def from_tuple(dados):
        if not dados or len(dados) < 11:
            return None
        return Candidato(
            id=dados[0],
            nome=dados[1],
            cpf=dados[2],
            email=dados[3],
            telefone=dados[4],
            curriculo=dados[5],
            curriculo_nome=dados[6],
            curriculo_tipo=dados[7],
            ativo=dados[8],
            excluido=dados[9],
            usuario_id=dados[10]
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cpf': self.cpf,
            'email': self.email,
            'telefone': self.telefone,
            'curriculo_nome': self.curriculo_nome,
            'curriculo_tipo': self.curriculo_tipo,
            'ativo': self.ativo,
            'usuario_id': self.usuario_id
        }
    
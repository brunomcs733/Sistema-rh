class Cliente:
    def __init__(self, id=None, cnpj=None, razao_social=None, nome_fantasia=None,
                 contato=None, ativo=True, excluido=False, usuario_id=None):
        self.id = id
        self.cnpj = cnpj
        self.razao_social = razao_social
        self.nome_fantasia = nome_fantasia
        self.contato = contato
        self.ativo = ativo
        self.excluido = excluido
        self.usuario_id = usuario_id
    
    @staticmethod
    def from_tuple(dados):
        if not dados:
            return None
        return Cliente(
            id=dados[0],
            cnpj=dados[1],
            razao_social=dados[2],
            nome_fantasia=dados[3],
            contato=dados[4],
            ativo=dados[5],
            excluido=dados[6],
            usuario_id=dados[7]
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'cnpj': self.cnpj,
            'razao_social': self.razao_social,
            'nome_fantasia': self.nome_fantasia,
            'contato': self.contato,
            'ativo': self.ativo,
            'usuario_id': self.usuario_id
        }
    
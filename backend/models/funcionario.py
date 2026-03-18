class Funcionario:
    def __init__(self, id=None, nome=None, cpf=None, cargo=None,
                 data_admissao=None, data_demissao=None, ativo=True,
                 excluido=False, cliente_id=None, usuario_id=None):
        self.id = id
        self.nome = nome
        self.cpf = cpf
        self.cargo = cargo
        self.data_admissao = data_admissao
        self.data_demissao = data_demissao
        self.ativo = ativo
        self.excluido = excluido
        self.cliente_id = cliente_id
        self.usuario_id = usuario_id
    
    @staticmethod
    def from_tuple(dados):
        if not dados or len(dados) < 9:
            return None
        return Funcionario(
            id=dados[0],
            nome=dados[1],
            cpf=dados[2],
            cargo=dados[3],
            data_admissao=dados[4],
            data_demissao=dados[5],
            ativo=dados[6],
            excluido=dados[7],
            cliente_id=dados[8],
            usuario_id=dados[9] if len(dados) > 9 else None
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cpf': self.cpf,
            'cargo': self.cargo,
            'data_admissao': str(self.data_admissao) if self.data_admissao else None,
            'data_demissao': str(self.data_demissao) if self.data_demissao else None,
            'ativo': self.ativo,
            'cliente_id': self.cliente_id,
            'usuario_id': self.usuario_id
        }
    
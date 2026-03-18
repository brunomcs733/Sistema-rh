class Vaga:
    def __init__(self, id=None, titulo=None, descricao=None, requisitos=None,
                 salario=None, data_abertura=None, data_encerramento=None,
                 ativa=True, excluido=False, cliente_id=None):
        self.id = id
        self.titulo = titulo
        self.descricao = descricao
        self.requisitos = requisitos
        self.salario = salario
        self.data_abertura = data_abertura
        self.data_encerramento = data_encerramento
        self.ativa = ativa
        self.excluido = excluido
        self.cliente_id = cliente_id
    
    @staticmethod
    def from_tuple(dados):
        if not dados or len(dados) < 10:
            return None
        return Vaga(
            id=dados[0],
            titulo=dados[1],
            descricao=dados[2],
            requisitos=dados[3],
            salario=dados[4],
            data_abertura=dados[5],
            data_encerramento=dados[6],
            ativa=dados[7],
            excluido=dados[8],
            cliente_id=dados[9]
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'requisitos': self.requisitos,
            'salario': float(self.salario) if self.salario else None,
            'data_abertura': str(self.data_abertura) if self.data_abertura else None,
            'data_encerramento': str(self.data_encerramento) if self.data_encerramento else None,
            'ativa': self.ativa,
            'cliente_id': self.cliente_id
        }
    
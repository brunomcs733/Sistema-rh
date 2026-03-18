class Candidatura:
    def __init__(self, id=None, data_candidatura=None, status='pendente',
                 excluido=False, vaga_id=None, candidato_id=None):
        self.id = id
        self.data_candidatura = data_candidatura
        self.status = status
        self.excluido = excluido
        self.vaga_id = vaga_id
        self.candidato_id = candidato_id
    
    @staticmethod
    def from_tuple(dados):
        if not dados or len(dados) < 6:
            return None
        return Candidatura(
            id=dados[0],
            data_candidatura=dados[1],
            status=dados[2],
            excluido=dados[3],
            vaga_id=dados[4],
            candidato_id=dados[5]
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'data_candidatura': str(self.data_candidatura) if self.data_candidatura else None,
            'status': self.status,
            'vaga_id': self.vaga_id,
            'candidato_id': self.candidato_id
        }
    
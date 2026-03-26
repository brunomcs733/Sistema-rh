class CandidaturaLista:
    def __init__(self, id=None, data_candidatura=None, status=None,
                 vaga_id=None, titulo=None, candidato_id=None, 
                 nome=None, razao_social=None):
        self.id = id
        self.data_candidatura = data_candidatura
        self.status = status
        self.vaga_id = vaga_id
        self.titulo = titulo
        self.candidato_id = candidato_id
        self.nome = nome
        self.razao_social = razao_social
    
    def to_dict(self):
        return {
            'id': self.id,
            'data_candidatura': str(self.data_candidatura) if self.data_candidatura else None,
            'status': self.status,
            'vaga_id': self.vaga_id,
            'titulo': self.titulo,
            'candidato_id': self.candidato_id,
            'nome': self.nome,
            'razao_social': self.razao_social
        }
    
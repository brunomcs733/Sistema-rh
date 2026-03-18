class Endereco:
    def __init__(self, id=None, logradouro=None, numero=None, complemento=None,
                 bairro=None, cidade=None, estado=None, cep=None,
                 comprovante=None, comprovante_nome=None, comprovante_tipo=None,
                 data_solicitacao=None, data_aprovacao=None, status='pendente',
                 motivo_rejeicao=None, funcionario_id=None, aprovado_por_usuario_id=None):
        self.id = id
        self.logradouro = logradouro
        self.numero = numero
        self.complemento = complemento
        self.bairro = bairro
        self.cidade = cidade
        self.estado = estado
        self.cep = cep
        self.comprovante = comprovante
        self.comprovante_nome = comprovante_nome
        self.comprovante_tipo = comprovante_tipo
        self.data_solicitacao = data_solicitacao
        self.data_aprovacao = data_aprovacao
        self.status = status
        self.motivo_rejeicao = motivo_rejeicao
        self.funcionario_id = funcionario_id
        self.aprovado_por_usuario_id = aprovado_por_usuario_id
    
    def to_dict(self):
        return {
            'id': self.id,
            'logradouro': self.logradouro,
            'numero': self.numero,
            'complemento': self.complemento,
            'bairro': self.bairro,
            'cidade': self.cidade,
            'estado': self.estado,
            'cep': self.cep,
            'comprovante_nome': self.comprovante_nome,
            'comprovante_tipo': self.comprovante_tipo,
            'data_solicitacao': str(self.data_solicitacao) if self.data_solicitacao else None,
            'status': self.status,
            'funcionario_id': self.funcionario_id
        }
    
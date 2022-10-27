export const formatUserObj = (usuario) => {
  return ({
    cpf: usuario.cpf,
    nome: usuario.nome,
    treinamentos_usuarios: {
      prazo: null
    }
  })
}

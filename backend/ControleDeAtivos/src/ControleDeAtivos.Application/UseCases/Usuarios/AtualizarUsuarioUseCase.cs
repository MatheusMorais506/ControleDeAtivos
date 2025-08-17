using ControleDeAtivos.Api.Requests.Usuario;
using ControleDeAtivos.Application.Interfaces.Criptografia;
using ControleDeAtivos.Application.Interfaces.Usuarios;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Usuarios
{
    public class AtualizarUsuarioservice : IAtualizarUsuarioService
    {
        private readonly IUsuarioRepository _repo;
        private readonly ICryptoService _cryptoService;

        public AtualizarUsuarioservice(
            IUsuarioRepository repo, 
            ICryptoService cryptoService)
        {
            _repo = repo;
            _cryptoService = cryptoService;
        }

        public async Task Execute(RequestAtualizarUsuarioJson request)
        {
            var usuario = await _repo.ObterPorIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Usuário não encontrado");

            var senhaDescriptografada = _cryptoService.Decrypt(request.Senha);

            usuario.Atualizar(
                request.Nome,
                request.Email,
                senhaDescriptografada,
                request.StatusId,
                request.PerfilId
            );

            await _repo.AtualizarAsync(usuario);
            await _repo.SalvarAsync();
        }
    }
}

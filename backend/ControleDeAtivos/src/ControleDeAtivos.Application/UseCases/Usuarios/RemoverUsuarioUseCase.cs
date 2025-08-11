using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Interfaces.Usuarios;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.services.Usuarios
{
    public class RemoverUsuarioservice : IRemoverUsuarioService
    {
        private readonly IUsuarioRepository _repo;

        public RemoverUsuarioservice(IUsuarioRepository repo) => _repo = repo;

        public async Task ExecuteAsync(int id)
        {
            var usuario = await _repo.ObterPorIdAsync(id) ?? throw new DomainException("Usuário não encontrado.");
            await _repo.RemoverAsync(usuario);
            await _repo.SalvarAsync();
        }
    }
}

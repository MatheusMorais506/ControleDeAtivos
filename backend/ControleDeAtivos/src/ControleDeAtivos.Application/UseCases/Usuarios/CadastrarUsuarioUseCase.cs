using ControleDeAtivos.Application.Interfaces.Usuarios;
using ControleDeAtivos.Application.Requests.Usuario;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Enums;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Usuarios
{
    public class CadastrarUsuarioservice : ICadastrarUsuarioService
    {
        private readonly IUsuarioRepository _repo;

        public CadastrarUsuarioservice(IUsuarioRepository repo) => _repo = repo;

        public async Task<ResponseCadastrarUsuarioJson> ExecuteAsync(RequestCadastrarUsuarioJson dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Login) || string.IsNullOrWhiteSpace(dto.Senha))
                throw new ArgumentException("Login e senha são obrigatórios");

            var usuario = new Usuario(
                dto.Login,
                dto.Nome,
                dto.Email,
                dto.StatusId,
                dto.PerfilId
            );

            usuario.DefinirSenha(dto.Senha);

            await _repo.AdicionarAsync(usuario);
            await _repo.SalvarAsync();

            return new ResponseCadastrarUsuarioJson
            {
                Id = usuario.Id,
                Login = usuario.Login,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Perfil = "",
                PerfilId = usuario.PerfilId.ToString(),
                Status = "",
                StatusId = usuario.StatusId.ToString(),
                DataCadastro = usuario.DataCadastro
            };
        }
    }
}

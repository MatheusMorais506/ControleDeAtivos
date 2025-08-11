using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Interfaces.Token;
using ControleDeAtivos.Application.Requests.Login;
using ControleDeAtivos.Application.Responses.Login;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.services.Autenticacao
{
    public class Loginservice : ILoginService
    {
        private readonly IAutenticacaoRepository _autenticacaoRepo;
        private readonly ITokenService _tokenService;

        public Loginservice(IAutenticacaoRepository autenticacaoRepo, ITokenService tokenService)
        {
            _autenticacaoRepo = autenticacaoRepo;
            _tokenService = tokenService;
        }

        public async Task<ResponseLoginJson> ExecuteAsync(RequestLoginJson request)
        {
            var usuario = await _autenticacaoRepo.ValidarCredenciaisAsync(request.Login);

            if (usuario == null)
                throw new UnauthorizedAccessException("Usuário inválido");

            bool senhaValida = BCrypt.Net.BCrypt.Verify(request.Senha, usuario.Senha);

            if (!senhaValida)
                throw new UnauthorizedAccessException("Credenciais inválidas");

            var accessToken = _tokenService.GenerateToken(usuario);

            var refreshToken = RefreshToken.Gerar(usuario.Id);

            await _autenticacaoRepo.AdicionarRefreshTokenAsync(refreshToken);
            await _autenticacaoRepo.SalvarAlteracoesAsync();

            return new ResponseLoginJson
            {
                Token = accessToken.Token,
                ExpiraEm = accessToken.ExpiraEm,
                Usuario = new ResponseConsultarUsuarioJson
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Email = usuario.Email
                },
                RefreshToken = refreshToken.Token
            };
        }
    }
}

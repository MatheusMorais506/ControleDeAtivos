using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Interfaces.Token;
using ControleDeAtivos.Application.Requests.Autenticacao;
using ControleDeAtivos.Application.Responses.Login;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.services.Autenticacao
{
    public class RefreshTokenservice : IRefreshService
    {
        private readonly IAutenticacaoRepository _autenticacaoRepo;
        private readonly ITokenService _tokenService;

        public RefreshTokenservice(
            IAutenticacaoRepository autenticacaoRepo, ITokenService tokenService)
        {
            _autenticacaoRepo = autenticacaoRepo;
            _tokenService = tokenService;
        }

        public async Task<ResponseLoginJson> ExecuteAsync(RequestRefreshTokenJson request)
        {
            var refreshToken = await _autenticacaoRepo.ObterRefreshTokenAsync(request.RefreshToken)
                ?? throw new UnauthorizedAccessException("Refresh token inválido");

            if (!refreshToken.EstaValido())
                throw new UnauthorizedAccessException("Refresh token expirado ou revogado");

            var usuario = await _autenticacaoRepo.ObterUsuarioPorIdAsync(refreshToken.UsuarioId)
                ?? throw new UnauthorizedAccessException("Usuário não encontrado");

            refreshToken.Revogar();
            await _autenticacaoRepo.AtualizarRefreshTokenAsync(refreshToken);

            var novoAccessToken = _tokenService.GenerateToken(usuario);
            var novoRefreshToken = RefreshToken.Gerar(usuario.Id);

            await _autenticacaoRepo.AdicionarRefreshTokenAsync(novoRefreshToken);
            await _autenticacaoRepo.SalvarAlteracoesAsync();

            return new ResponseLoginJson
            {
                Token = novoAccessToken.Token,
                ExpiraEm = novoAccessToken.ExpiraEm,
                Usuario = new ResponseConsultarUsuarioJson
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Email = usuario.Email
                },
                RefreshToken = novoRefreshToken.Token
            };
        }
    }
}

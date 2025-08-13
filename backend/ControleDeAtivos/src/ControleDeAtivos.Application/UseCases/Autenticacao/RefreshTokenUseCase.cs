using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Interfaces.Token;
using ControleDeAtivos.Application.Requests.Autenticacao;
using ControleDeAtivos.Application.Responses.Login;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Autenticacao
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

        public async Task<(string AccessToken, DateTime ExpiraEm, string RefreshToken)> ExecuteAsync(string refreshToken)
        {
            var tokenExistente = await _autenticacaoRepo.ObterRefreshTokenAsync(refreshToken)
                ?? throw new UnauthorizedAccessException("Refresh token inválido");

            if (!tokenExistente.EstaValido())
                throw new UnauthorizedAccessException("Refresh token expirado ou revogado");

            var usuario = await _autenticacaoRepo.ObterUsuarioPorIdAsync(tokenExistente.UsuarioId)
                ?? throw new UnauthorizedAccessException("Usuário não encontrado");

            tokenExistente.Revogar();
            await _autenticacaoRepo.AtualizarRefreshTokenAsync(tokenExistente);

            var novoAccessToken = _tokenService.GenerateToken(usuario);
            var novoRefreshToken = RefreshToken.Gerar(usuario.Id);

            await _autenticacaoRepo.AdicionarRefreshTokenAsync(novoRefreshToken);
            await _autenticacaoRepo.SalvarAlteracoesAsync();

            return (novoAccessToken.Token, novoAccessToken.ExpiraEm, novoRefreshToken.Token);
        }
    }
}

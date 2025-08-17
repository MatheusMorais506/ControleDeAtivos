using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Interfaces.Criptografia;
using ControleDeAtivos.Application.Interfaces.Token;
using ControleDeAtivos.Application.Requests.Login;
using ControleDeAtivos.Application.Responses.Login;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Enums;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Autenticacao
{
    public class Loginservice : ILoginService
    {
        private readonly IAutenticacaoRepository _autenticacaoRepo;
        private readonly ITokenService _tokenService;
        private readonly ICryptoService _cryptoService;

        public Loginservice(
            IAutenticacaoRepository autenticacaoRepo, 
            ITokenService tokenService,
            ICryptoService cryptoService)
        {
            _autenticacaoRepo = autenticacaoRepo;
            _tokenService = tokenService;
            _cryptoService = cryptoService;
        }

        public async Task<ResponseLoginJson> ExecuteAsync(RequestLoginJson request)
        {
            if (string.IsNullOrWhiteSpace(request.Login) || string.IsNullOrWhiteSpace(request.Senha))
                throw new ArgumentException("Login e senha são obrigatórios");

            var statusInativo = (int)StatusUsuario.Inativo;

            var usuario = await _autenticacaoRepo.ValidarCredenciaisAsync(request.Login, statusInativo)
                ?? throw new UnauthorizedAccessException("Usuário inválido");

            var senhaDescriptografada = _cryptoService.Decrypt(request.Senha);

            bool senhaValida = BCrypt.Net.BCrypt.Verify(senhaDescriptografada, usuario.Senha);
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
                    Email = usuario.Email,
                    Login = usuario.Login,
                    Perfil = usuario.Perfil.Descricao,
                    Status = usuario.Status.Descricao,
                    PerfilId = usuario.Perfil.Id.ToString(),
                    StatusId = usuario.Status.Id.ToString(),
                    DataCadastro = usuario.DataCadastro.ToString()
                },
                RefreshToken = refreshToken.Token
            };
        }
    }
}

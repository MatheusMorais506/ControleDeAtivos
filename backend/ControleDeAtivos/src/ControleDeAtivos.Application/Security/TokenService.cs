using ControleDeAtivos.Application.Interfaces.Token;
using ControleDeAtivos.Application.Responses.Autenticacao;
using ControleDeAtivos.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ControleDeAtivos.Infraestructure.Security
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ResponseTokenJson GenerateToken(Usuario usuario)
        {
            var chaveSecreta = _configuration["Jwt:ChaveSecreta"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var validade = int.Parse(_configuration["Jwt:ValidadeEmMinutos"]);

            var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveSecreta));
            var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                new Claim("nome", usuario.Nome),
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(validade),
                signingCredentials: credenciais);

            return new ResponseTokenJson
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiraEm = token.ValidTo
            };
        }
    }
}

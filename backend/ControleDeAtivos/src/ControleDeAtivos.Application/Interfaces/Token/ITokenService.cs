using ControleDeAtivos.Application.Responses.Autenticacao;
using ControleDeAtivos.Domain.Entities;

namespace ControleDeAtivos.Application.Interfaces.Token
{
    public interface ITokenService
    {
        ResponseTokenJson GenerateToken(Usuario usuario);
    }
}

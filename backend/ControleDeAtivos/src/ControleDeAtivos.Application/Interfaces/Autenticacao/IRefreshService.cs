using ControleDeAtivos.Application.Requests.Autenticacao;
using ControleDeAtivos.Application.Responses.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Autenticacao
{
    public interface IRefreshService
    {
        Task<ResponseLoginJson> ExecuteAsync(RequestRefreshTokenJson request);
    }
}

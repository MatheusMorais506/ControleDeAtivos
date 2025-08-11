using ControleDeAtivos.Api.Requests.Usuario;
using ControleDeAtivos.Application.Requests.Login;
using ControleDeAtivos.Application.Responses.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Autenticacao
{
    public interface ILoginService
    {
        public Task<ResponseLoginJson> ExecuteAsync(RequestLoginJson request);
    }
}

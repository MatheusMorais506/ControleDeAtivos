using ControleDeAtivos.Application.Requests.Usuario;
using ControleDeAtivos.Application.Responses.Usuario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Usuarios
{
    public interface ICadastrarUsuarioService
    {
        public Task<ResponseCadastrarUsuarioJson> ExecuteAsync(RequestCadastrarUsuarioJson request);
    }
}

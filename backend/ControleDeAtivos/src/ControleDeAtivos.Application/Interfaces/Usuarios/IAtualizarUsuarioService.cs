using ControleDeAtivos.Api.Requests.Usuario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Usuarios
{
    public interface IAtualizarUsuarioService
    {
        Task Execute(RequestAtualizarUsuarioJson request);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Usuarios
{
    public interface IRemoverUsuarioService
    {
        public Task ExecuteAsync(int idUsuario);
    }
}

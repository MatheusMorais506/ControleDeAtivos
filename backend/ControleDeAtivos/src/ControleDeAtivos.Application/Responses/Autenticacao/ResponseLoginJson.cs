using ControleDeAtivos.Application.Responses.Usuario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Responses.Login
{
    public class ResponseLoginJson
    {
        public string Token { get; init; }
        public DateTime ExpiraEm { get; init; }
        public ResponseConsultarUsuarioJson Usuario { get; init; }
        public string RefreshToken { get; init; }
    }
}

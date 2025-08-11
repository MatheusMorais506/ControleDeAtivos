using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Requests.Login
{
    public class RequestLoginJson
    {
        public string Login { get; init; }
        public string Senha { get; init; }
    }
}

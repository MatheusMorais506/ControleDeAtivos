using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Responses.Autenticacao
{
    public class ResponseTokenJson
    {
        public string? Token { get; set; }
        public DateTime ExpiraEm { get; set; }
    }
}

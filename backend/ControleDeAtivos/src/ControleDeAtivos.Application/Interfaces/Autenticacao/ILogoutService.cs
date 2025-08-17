using ControleDeAtivos.Application.Requests.Autenticacao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Autenticacao
{
    public interface ILogoutService
    {
        Task ExecuteAsync(string request);
    }
}

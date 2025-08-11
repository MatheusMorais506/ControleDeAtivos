using ControleDeAtivos.Application.Requests.Usuario;
using ControleDeAtivos.Application.Responses;
using ControleDeAtivos.Application.Responses.Equipamento;
using ControleDeAtivos.Application.Responses.Usuario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Equipamentos
{
    public interface IListarEquipamentoService
    {
        Task<List<ResponseEquipamentoJson>> ListarAsync();
    }
}

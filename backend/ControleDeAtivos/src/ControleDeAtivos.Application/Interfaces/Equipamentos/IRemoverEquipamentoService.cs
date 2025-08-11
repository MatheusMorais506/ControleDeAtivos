using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Equipamentos
{
    public interface IRemoverEquipamentoService
    {
        Task RemoverAsync(int id);
    }
}

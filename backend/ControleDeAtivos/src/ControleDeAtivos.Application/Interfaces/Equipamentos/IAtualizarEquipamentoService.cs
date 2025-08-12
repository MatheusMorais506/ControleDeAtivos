using ControleDeAtivos.Application.Requests.Equipamento;
using ControleDeAtivos.Application.Requests.Usuario;
using ControleDeAtivos.Application.Responses.Equipamento;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Interfaces.Equipamentos
{
    public interface IAtualizarEquipamentoService
    {
        Task AtualizarAsync(int id, RequestCadastrarEquipamentoJson equipamento);
    }
}

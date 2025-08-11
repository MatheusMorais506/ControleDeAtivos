using ControleDeAtivos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Domain.Repositories
{
    public interface IEquipamentoRepository
    {
        Task<List<Equipamento>> ObterTodosAsync();
        Task<Equipamento?> ObterPorIdAsync(int id);
        Task AdicionarAsync(Equipamento equipamento);
        void Remover(Equipamento equipamento);
        void Atualizar(Equipamento equipamento);
        Task SalvarAsync();
    }
}

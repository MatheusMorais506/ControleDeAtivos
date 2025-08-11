using ControleDeAtivos.Application.Interfaces;
using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Responses.Equipamento;
using ControleDeAtivos.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.services.Equipamentos
{
    public class ListarEquipamentoservice : IListarEquipamentoService
    {
        private readonly IEquipamentoRepository _repo;

        public ListarEquipamentoservice(IEquipamentoRepository repo) => _repo = repo;

        public async Task<List<ResponseEquipamentoJson>> ListarAsync()
        {
            var equipamentos = await _repo.ObterTodosAsync();
            return equipamentos
                .Select(e => new ResponseEquipamentoJson(e.Id, e.Nome, e.CodigoIdentificacao, e.Status, e.NotaEmprestimo))
                .ToList();
        }
    }
}

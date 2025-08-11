using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Responses.Equipamento;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.services.Equipamentos
{
    public class CadastrarEquipamentoservice : ICadastrarEquipamentoService
    {
        private readonly IEquipamentoRepository _repo;

        public CadastrarEquipamentoservice(IEquipamentoRepository repo) => _repo = repo;

        public async Task<ResponseEquipamentoJson> CadastrarAsync(string nome, string codigo)
        {
            var equipamento = new Equipamento(nome, codigo);
            await _repo.AdicionarAsync(equipamento);
            await _repo.SalvarAsync();

            return new ResponseEquipamentoJson(
                equipamento.Id,
                equipamento.Nome,
                equipamento.CodigoIdentificacao,
                equipamento.Status,
                equipamento.NotaEmprestimo);
        }
    }
}

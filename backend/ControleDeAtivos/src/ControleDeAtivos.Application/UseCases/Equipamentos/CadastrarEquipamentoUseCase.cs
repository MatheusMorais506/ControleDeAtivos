using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Responses.Equipamento;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Equipamentos
{
    public class CadastrarEquipamentoservice : ICadastrarEquipamentoService
    {
        private readonly IEquipamentoRepository _repo;

        public CadastrarEquipamentoservice(IEquipamentoRepository repo) => _repo = repo;

        public async Task<ResponseEquipamentoJson> CadastrarAsync(string nome, string codigo)
        {
            if (string.IsNullOrWhiteSpace(nome) || string.IsNullOrWhiteSpace(codigo))
                throw new ArgumentException("Nome e código são obrigatórios");

            if (await _repo.CodigoIdentificacaoJaExisteAsync(codigo))
                throw new DomainException("Código de identificação já existe.");

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

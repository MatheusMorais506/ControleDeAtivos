using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Equipamentos
{
    public class EmprestarEquipamentoservice : IEmprestarEquipamentoService
    {
        private readonly IEquipamentoRepository _repo;

        public EmprestarEquipamentoservice(IEquipamentoRepository repo) => _repo = repo;

        public async Task EmprestarAsync(int id, string nota)
        {
            var equipamento = await _repo.ObterPorIdAsync(id)
                ?? throw new DomainException("Equipamento não encontrado.");

            equipamento.RealizarEmprestimo(nota);

            _repo.Atualizar(equipamento);
            await _repo.SalvarAsync();
        }
    }
}

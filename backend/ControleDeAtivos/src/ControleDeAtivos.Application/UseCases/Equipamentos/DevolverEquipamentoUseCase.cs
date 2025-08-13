using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Equipamentos
{
    public class DevolverEquipamentoservice : IDevolverEquipamentoService
    {
        private readonly IEquipamentoRepository _repo;

        public DevolverEquipamentoservice(IEquipamentoRepository repo) => _repo = repo;

        public async Task DevolverAsync(int id)
        {
            var equipamento = await _repo.ObterPorIdAsync(id)
                ?? throw new KeyNotFoundException("Equipamento não encontrado");

            equipamento.RegistrarDevolucao();

            _repo.Atualizar(equipamento);
            await _repo.SalvarAsync();
        }
    }
}

using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.services.Equipamentos
{
    public class RemoverEquipamentoservice : IRemoverEquipamentoService
    {
        private readonly IEquipamentoRepository _repo;

        public RemoverEquipamentoservice(IEquipamentoRepository repo) => _repo = repo;

        public async Task RemoverAsync(int id)
        {
            var equipamento = await _repo.ObterPorIdAsync(id)
                ?? throw new DomainException("Equipamento não encontrado.");

            _repo.Remover(equipamento);
            await _repo.SalvarAsync();
        }
    }
}

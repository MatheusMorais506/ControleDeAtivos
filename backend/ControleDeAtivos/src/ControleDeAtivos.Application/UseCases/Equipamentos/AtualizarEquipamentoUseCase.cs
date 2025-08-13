using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Requests.Equipamento;
using ControleDeAtivos.Application.Responses.Equipamento;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;

namespace ControleDeAtivos.Application.UseCases.Equipamentos
{
    public class AtualizarEquipamentoservice : IAtualizarEquipamentoService
    {
        private readonly IEquipamentoRepository _repo;

        public AtualizarEquipamentoservice(IEquipamentoRepository repo) => _repo = repo;

        public async Task AtualizarAsync(int id, RequestCadastrarEquipamentoJson equipamento)
        {
            var equipamentoEncontrado = await _repo.ObterPorIdAsync(id)
                ?? throw new DomainException("Equipamento não encontrado.");

            equipamentoEncontrado.AtualizarDados(equipamento.Nome, equipamento.CodigoIdentificacao);

            _repo.Atualizar(equipamentoEncontrado);
            await _repo.SalvarAsync();
        }
    }
}

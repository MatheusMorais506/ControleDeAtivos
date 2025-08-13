using ControleDeAtivos.Application.UseCases.Equipamentos;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace ControleDeAtivos.Tests.UseCases.Equipamentos
{
    public class DevolverEquipamentoUseCaseTests
    {
        private readonly Mock<IEquipamentoRepository> _repoMock;
        private readonly DevolverEquipamentoservice _useCase;

        public DevolverEquipamentoUseCaseTests()
        {
            _repoMock = new Mock<IEquipamentoRepository>();
            _useCase = new DevolverEquipamentoservice(_repoMock.Object);
        }

        [Fact]
        public async Task DevolverAsync_EquipamentoExiste_DeveRegistrarDevolucao()
        {
            var equipamento = new Equipamento("Nome", "COD123");
            equipamento.RealizarEmprestimo("Nota123");

            _repoMock.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(equipamento);
            _repoMock.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _useCase.DevolverAsync(1);

            equipamento.NotaEmprestimo.Should().BeNull();
            _repoMock.Verify(r => r.Atualizar(equipamento), Times.Once);
            _repoMock.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task DevolverAsync_EquipamentoNaoExiste_DeveLancarKeyNotFoundException()
        {
            _repoMock.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync((Equipamento?)null);

            await Assert.ThrowsAsync<KeyNotFoundException>(() => _useCase.DevolverAsync(1));
        }
    }

}

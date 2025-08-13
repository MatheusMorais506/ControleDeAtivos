using ControleDeAtivos.Application.UseCases.Equipamentos;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace ControleDeAtivos.Tests.UseCases.Equipamentos
{
    public class EmprestarEquipamentoUseCaseTests
    {
        private readonly Mock<IEquipamentoRepository> _repoMock;
        private readonly EmprestarEquipamentoservice _useCase;

        public EmprestarEquipamentoUseCaseTests()
        {
            _repoMock = new Mock<IEquipamentoRepository>();
            _useCase = new EmprestarEquipamentoservice(_repoMock.Object);
        }

        [Fact]
        public async Task EmprestarAsync_EquipamentoDisponivel_DeveEmprestar()
        {
            var equipamento = new Equipamento("Nome", "COD123");
            _repoMock.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(equipamento);
            _repoMock.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _useCase.EmprestarAsync(1, "Nota123");

            equipamento.NotaEmprestimo.Should().Be("Nota123");
            _repoMock.Verify(r => r.Atualizar(equipamento), Times.Once);
            _repoMock.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task EmprestarAsync_EquipamentoJaEmprestado_DeveLancarInvalidOperationException()
        {
            var equipamento = new Equipamento("Nome", "COD123");
            equipamento.RealizarEmprestimo("NotaExistente");
            _repoMock.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(equipamento);

            await Assert.ThrowsAsync<InvalidOperationException>(() => _useCase.EmprestarAsync(1, "NovaNota"));
        }

        [Fact]
        public async Task EmprestarAsync_EquipamentoNaoExiste_DeveLancarKeyNotFoundException()
        {
            _repoMock.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync((Equipamento?)null);

            await Assert.ThrowsAsync<KeyNotFoundException>(() => _useCase.EmprestarAsync(1, "Nota"));
        }
    }

}

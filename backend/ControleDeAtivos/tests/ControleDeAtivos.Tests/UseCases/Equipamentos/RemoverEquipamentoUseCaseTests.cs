using ControleDeAtivos.Application.UseCases.Equipamentos;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using Moq;
using Xunit;

namespace ControleDeAtivos.Tests.UseCases.Equipamentos
{
    public class RemoverEquipamentoUseCaseTests
    {
        private readonly Mock<IEquipamentoRepository> _repoMock;
        private readonly RemoverEquipamentoservice _useCase;

        public RemoverEquipamentoUseCaseTests()
        {
            _repoMock = new Mock<IEquipamentoRepository>();
            _useCase = new RemoverEquipamentoservice(_repoMock.Object);
        }

        [Fact]
        public async Task RemoverAsync_EquipamentoExiste_DeveRemover()
        {
            var equipamento = new Equipamento("Nome", "COD123");
            _repoMock.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(equipamento);
            _repoMock.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _useCase.RemoverAsync(1);

            _repoMock.Verify(r => r.Remover(equipamento), Times.Once);
            _repoMock.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task RemoverAsync_EquipamentoNaoExiste_DeveLancarKeyNotFoundException()
        {
            _repoMock.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync((Equipamento?)null);

            await Assert.ThrowsAsync<KeyNotFoundException>(() => _useCase.RemoverAsync(1));
        }
    }

}

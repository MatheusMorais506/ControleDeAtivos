using Bogus;
using ControleDeAtivos.Application.Requests.Equipamento;
using ControleDeAtivos.Application.UseCases.Equipamentos;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using Moq;
using Xunit;

namespace ControleDeAtivos.Tests.UseCases.Equipamentos
{
    public class AtualizarEquipamentoUseCaseTests
    {
        private readonly Mock<IEquipamentoRepository> _repoMock;
        private readonly AtualizarEquipamentoservice _useCase;
        private readonly Faker<RequestCadastrarEquipamentoJson> _faker;

        public AtualizarEquipamentoUseCaseTests()
        {
            _repoMock = new Mock<IEquipamentoRepository>();
            _useCase = new AtualizarEquipamentoservice(_repoMock.Object);

            _faker = new Faker<RequestCadastrarEquipamentoJson>()
                .RuleFor(r => r.Nome, f => f.Commerce.ProductName())
                .RuleFor(r => r.CodigoIdentificacao, f => f.Random.AlphaNumeric(10).ToUpper());
        }

        [Fact]
        public async Task AtualizarAsync_EquipamentoExiste_DeveAtualizar()
        {
            var request = _faker.Generate();
            var equipamento = new Equipamento("OldNome", "OLD123");

            _repoMock.Setup(r => r.ObterPorIdAsync(It.IsAny<int>())).ReturnsAsync(equipamento);
            _repoMock.Setup(r => r.SalvarAsync()).Returns(Task.CompletedTask);

            await _useCase.AtualizarAsync(1, request);

            _repoMock.Verify(r => r.Atualizar(It.Is<Equipamento>(e =>
                e.Nome == request.Nome &&
                e.CodigoIdentificacao == request.CodigoIdentificacao
            )), Times.Once);

            _repoMock.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task AtualizarAsync_EquipamentoNaoExiste_DeveLancarKeyNotFoundException()
        {
            _repoMock.Setup(r => r.ObterPorIdAsync(It.IsAny<int>())).ReturnsAsync((Equipamento?)null);

            await Assert.ThrowsAsync<KeyNotFoundException>(() => _useCase.AtualizarAsync(1, _faker.Generate()));
        }
    }

}

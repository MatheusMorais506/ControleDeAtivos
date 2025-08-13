using ControleDeAtivos.Application.UseCases.Equipamentos;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace ControleDeAtivos.Tests.UseCases.Equipamentos
{
    public class ListarEquipamentoUseCaseTests
    {
        private readonly Mock<IEquipamentoRepository> _repoMock;
        private readonly ListarEquipamentoservice _useCase;

        public ListarEquipamentoUseCaseTests()
        {
            _repoMock = new Mock<IEquipamentoRepository>();
            _useCase = new ListarEquipamentoservice(_repoMock.Object);
        }

        [Fact]
        public async Task ListarAsync_DeveRetornarListaDeResponseEquipamentoJson()
        {
            var equipamentos = new List<Equipamento>
        {
            new Equipamento("Nome1", "COD1"),
            new Equipamento("Nome2", "COD2")
        };
            _repoMock.Setup(r => r.ObterTodosAsync()).ReturnsAsync(equipamentos);

            var resultado = await _useCase.ListarAsync();

            resultado.Should().HaveCount(2);
            resultado[0].Nome.Should().Be("Nome1");
            resultado[1].CodigoIdentificacao.Should().Be("COD2");
        }
    }

}

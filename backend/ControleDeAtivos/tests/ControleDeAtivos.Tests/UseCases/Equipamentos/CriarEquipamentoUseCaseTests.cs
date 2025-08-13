using Bogus;
using ControleDeAtivos.Application.Requests.Equipamento;
using ControleDeAtivos.Application.UseCases.Equipamentos;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

public class CriarEquipamentoUseCaseTests
{
    private readonly Mock<IEquipamentoRepository> _equipamentoRepositoryMock;
    private readonly CadastrarEquipamentoservice _useCase;
    private readonly Faker<RequestCadastrarEquipamentoJson> _requestFaker;

    public CriarEquipamentoUseCaseTests()
    {
        _equipamentoRepositoryMock = new Mock<IEquipamentoRepository>();
        _useCase = new CadastrarEquipamentoservice(_equipamentoRepositoryMock.Object);

        _requestFaker = new Faker<RequestCadastrarEquipamentoJson>()
            .RuleFor(r => r.Nome, f => f.Commerce.ProductName())
            .RuleFor(r => r.CodigoIdentificacao, f => f.Random.AlphaNumeric(10).ToUpper());
    }

    [Fact]
    public async Task CadastrarAsync_ComDadosValidos_DeveCriarERetornarEquipamento()
    {
        var request = _requestFaker.Generate();

        _equipamentoRepositoryMock
            .Setup(r => r.CodigoIdentificacaoJaExisteAsync(request.CodigoIdentificacao))
            .ReturnsAsync(false);

        _equipamentoRepositoryMock
            .Setup(r => r.AdicionarAsync(It.IsAny<Equipamento>()))
            .Callback<Equipamento>(e => e.GetType().GetProperty("Id")!
            .SetValue(e, 1));

        _equipamentoRepositoryMock
            .Setup(r => r.SalvarAsync())
            .Returns(Task.CompletedTask);

        var resultado = await _useCase.CadastrarAsync(request.Nome, request.CodigoIdentificacao);

        resultado.Should().NotBeNull();
        resultado.Nome.Should().Be(request.Nome);
        resultado.CodigoIdentificacao.Should().Be(request.CodigoIdentificacao);
        resultado.Id.Should().BeGreaterThan(0);
        resultado.Status.Should().BeFalse();
        resultado.NotaEmprestimo.Should().BeNull();

        _equipamentoRepositoryMock.Verify(r =>
            r.AdicionarAsync(It.Is<Equipamento>(e =>
                e.Nome == request.Nome &&
                e.CodigoIdentificacao == request.CodigoIdentificacao
            )), Times.Once);

        _equipamentoRepositoryMock.Verify(r => r.SalvarAsync(), Times.Once);
    }

    [Fact]
    public async Task CadastrarAsync_ComCodigoDeIdentificacaoExistente_DeveLancarDomainException()
    {
        var request = _requestFaker.Generate();

        _equipamentoRepositoryMock
            .Setup(r => r.CodigoIdentificacaoJaExisteAsync(request.CodigoIdentificacao))
            .ReturnsAsync(true);

        await Assert.ThrowsAsync<DomainException>(() =>
            _useCase.CadastrarAsync(request.Nome, request.CodigoIdentificacao));

        _equipamentoRepositoryMock.Verify(r => r.AdicionarAsync(It.IsAny<Equipamento>()), Times.Never);
        _equipamentoRepositoryMock.Verify(r => r.SalvarAsync(), Times.Never);
    }

    [Theory]
    [InlineData(null, "COD123")]
    [InlineData("", "COD123")]
    [InlineData("Nome", null)]
    [InlineData("Nome", "")]
    public async Task CadastrarAsync_ComNomeOuCodigoInvalidos_DeveLancarArgumentException(string nome, string codigo)
    {
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _useCase.CadastrarAsync(nome, codigo));

        _equipamentoRepositoryMock.Verify(r => r.AdicionarAsync(It.IsAny<Equipamento>()), Times.Never);
        _equipamentoRepositoryMock.Verify(r => r.SalvarAsync(), Times.Never);
    }
}


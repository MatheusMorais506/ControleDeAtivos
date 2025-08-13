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
    public async Task Executar_ComDadosValidos_DeveCriarERetornarIdDoEquipamento()
    {
        var request = _requestFaker.Generate();

        _equipamentoRepositoryMock
            .Setup(r => r.CodigoIdentificacaoJaExisteAsync(request.CodigoIdentificacao))
            .ReturnsAsync(false);

        _equipamentoRepositoryMock
            .Setup(r => r.AdicionarAsync(It.IsAny<Equipamento>()));
        _equipamentoRepositoryMock
            .Setup(r => r.SalvarAsync())
            .Returns(Task.CompletedTask);

        var resultadoId = await _useCase.CadastrarAsync(request.Nome, request.CodigoIdentificacao);

        resultadoId.Should().NotBe(0);

        _equipamentoRepositoryMock.Verify(r =>
            r.AdicionarAsync(It.Is<Equipamento>(e =>
                e.Nome == request.Nome &&
                e.CodigoIdentificacao == request.CodigoIdentificacao
            )), Times.Once);

        _equipamentoRepositoryMock.Verify(r => r.SalvarAsync(), Times.Once);
    }

    [Fact]
    public async Task Executar_ComCodigoDeIdentificacaoJaExistente_DeveLancarDomainException()
    {
        var request = _requestFaker.Generate();

        _equipamentoRepositoryMock
            .Setup(r => r.CodigoIdentificacaoJaExisteAsync(request.CodigoIdentificacao))
            .ReturnsAsync(true);

        await Assert.ThrowsAsync<DomainException>(() => _useCase.CadastrarAsync(request.Nome, request.CodigoIdentificacao));

        _equipamentoRepositoryMock.Verify(r => r.AdicionarAsync(It.IsAny<Equipamento>()), Times.Never);
        _equipamentoRepositoryMock.Verify(r => r.SalvarAsync(), Times.Never);
    }
}
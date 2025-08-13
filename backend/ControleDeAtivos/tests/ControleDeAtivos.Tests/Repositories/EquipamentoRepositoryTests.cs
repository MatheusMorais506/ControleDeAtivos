using Bogus;
using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Infrastructure.Data;
using ControleDeAtivos.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;
public class EquipamentoRepositoryTests
{
    private readonly DbContextOptions<AppDbContext> _dbContextOptions;
    private readonly Faker<Equipamento> _equipamentoFaker;

    public EquipamentoRepositoryTests()
    {
        _dbContextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _equipamentoFaker = new Faker<Equipamento>("pt_BR")
            .CustomInstantiator(f => new Equipamento(
                f.Commerce.ProductName(),
                f.Random.AlphaNumeric(10).ToUpper()
            ));
    }

    private AppDbContext CreateContext() => new AppDbContext(_dbContextOptions);

    [Fact]
    public async Task AdicionarAsync_DeveSalvarEquipamentoNoBancoDeDados()
    {
        await using var context = CreateContext();
        var repository = new EquipamentoRepository(context);
        var novoEquipamento = _equipamentoFaker.Generate();

        await repository.AdicionarAsync(novoEquipamento);
        await repository.SalvarAsync();

        var equipamentoSalvo = await context.Equipamentos.FindAsync(novoEquipamento.Id);
        equipamentoSalvo.Should().NotBeNull();
        equipamentoSalvo.Nome.Should().Be(novoEquipamento.Nome);
        equipamentoSalvo.CodigoIdentificacao.Should().Be(novoEquipamento.CodigoIdentificacao);
    }

    [Fact]
    public async Task ObterPorIdAsync_DeveRetornarEquipamentoCorreto()
    {
        await using var context = CreateContext();
        var repository = new EquipamentoRepository(context);
        var equipamentoExistente = _equipamentoFaker.Generate();

        await context.Equipamentos.AddAsync(equipamentoExistente);
        await context.SaveChangesAsync();

        var resultado = await repository.ObterPorIdAsync(equipamentoExistente.Id);

        resultado.Should().NotBeNull();
        resultado.Should().BeEquivalentTo(equipamentoExistente);
    }

    [Fact]
    public async Task ObterTodosAsync_DeveRetornarListaDeEquipamentos()
    {
        await using var context = CreateContext();
        var repository = new EquipamentoRepository(context);
        var equipamentos = _equipamentoFaker.Generate(3);

        await context.Equipamentos.AddRangeAsync(equipamentos);
        await context.SaveChangesAsync();

        var resultado = await repository.ObterTodosAsync();

        resultado.Should().NotBeNull();
        resultado.Should().HaveCount(3);
        resultado.Should().BeEquivalentTo(equipamentos);
    }

    [Fact]
    public async Task CodigoIdentificacaoJaExisteAsync_RetornaTrueQuandoExiste()
    {
        await using var context = CreateContext();
        var repository = new EquipamentoRepository(context);
        var equipamento = _equipamentoFaker.Generate();

        await context.Equipamentos.AddAsync(equipamento);
        await context.SaveChangesAsync();

        var existe = await repository.CodigoIdentificacaoJaExisteAsync(equipamento.CodigoIdentificacao);
        existe.Should().BeTrue();
    }

    [Fact]
    public async Task CodigoIdentificacaoJaExisteAsync_RetornaFalseQuandoNaoExiste()
    {
        await using var context = CreateContext();
        var repository = new EquipamentoRepository(context);

        var existe = await repository.CodigoIdentificacaoJaExisteAsync("CODIGO_INVALIDO");
        existe.Should().BeFalse();
    }

    [Fact]
    public async Task Atualizar_DeveModificarEquipamentoExistente()
    {
        await using var context = CreateContext();
        var repository = new EquipamentoRepository(context);
        var equipamento = _equipamentoFaker.Generate();

        await context.Equipamentos.AddAsync(equipamento);
        await context.SaveChangesAsync();

        equipamento.AtualizarDados("NomeNovo", "CODNOVO");
        repository.Atualizar(equipamento);
        await repository.SalvarAsync();

        var atualizado = await context.Equipamentos.FindAsync(equipamento.Id);
        atualizado.Nome.Should().Be("NomeNovo");
        atualizado.CodigoIdentificacao.Should().Be("CODNOVO");
    }

    [Fact]
    public async Task Remover_DeveExcluirEquipamento()
    {
        await using var context = CreateContext();
        var repository = new EquipamentoRepository(context);
        var equipamento = _equipamentoFaker.Generate();

        await context.Equipamentos.AddAsync(equipamento);
        await context.SaveChangesAsync();

        repository.Remover(equipamento);
        await repository.SalvarAsync();

        var deletado = await context.Equipamentos.FindAsync(equipamento.Id);
        deletado.Should().BeNull();
    }
}

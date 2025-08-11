using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using ControleDeAtivos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleDeAtivos.Infrastructure.Repositories
{
    public class EquipamentoRepository : IEquipamentoRepository
    {
        private readonly AppDbContext _context;
        public EquipamentoRepository(AppDbContext context) => _context = context;

        public async Task<List<Equipamento>> ObterTodosAsync() => await _context.Equipamentos.ToListAsync();
        public async Task<Equipamento?> ObterPorIdAsync(int id) => await _context.Equipamentos.FindAsync(id);
        public async Task AdicionarAsync(Equipamento equipamento) => await _context.Equipamentos.AddAsync(equipamento);
        public void Atualizar(Equipamento equipamento) => _context.Equipamentos.Update(equipamento);
        public void Remover(Equipamento equipamento) => _context.Equipamentos.Remove(equipamento);
        public async Task SalvarAsync() => await _context.SaveChangesAsync();
    }
}

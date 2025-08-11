using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using ControleDeAtivos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleDeAtivos.Infrastructure.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;
        public UsuarioRepository(AppDbContext context) => _context = context;

        public async Task<List<Usuario>> ObterTodosAsync() => await _context.Usuarios.ToListAsync();
        public async Task<Usuario?> ObterPorIdAsync(int id) => await _context.Usuarios.FindAsync(id);
        public async Task AdicionarAsync(Usuario usuario) => await _context.Usuarios.AddAsync(usuario);
        public async Task AtualizarAsync(Usuario usuario) => _context.Usuarios.Update(usuario);
        public async Task RemoverAsync(Usuario usuario) => _context.Usuarios.Remove(usuario);
        public async Task SalvarAsync() => await _context.SaveChangesAsync();
    }
}

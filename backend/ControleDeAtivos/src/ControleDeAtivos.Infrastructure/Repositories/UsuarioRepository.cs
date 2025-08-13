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
        
        public async Task<List<Usuario>> ObterTodosAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Status)
                .Include(u => u.Perfil)
                .ToListAsync();
        }

        public async Task<Usuario?> ObterPorIdAsync(int id)
        {
            return await _context.Usuarios
                .Include(u => u.Status)
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<Usuario?> ObterPorLoginAsync(string login)
        {
            return await _context.Usuarios
                .Include(u => u.Status)
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Login == login);
        }

        public async Task AdicionarAsync(Usuario usuario) => await _context.Usuarios.AddAsync(usuario);
        
        public async Task AtualizarAsync(Usuario usuario) => _context.Usuarios.Update(usuario);

        //public async Task RemoverAsync(Usuario usuario) => _context.Usuarios.Remove(usuario);

        public async Task RemoverAsync(Usuario usuario) => _context.Usuarios.Update(usuario);

        public async Task SalvarAsync() => await _context.SaveChangesAsync();
    }
}

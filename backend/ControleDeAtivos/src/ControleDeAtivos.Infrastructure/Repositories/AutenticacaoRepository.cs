using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Repositories;
using ControleDeAtivos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleDeAtivos.Infrastructure.Repositories
{
    public class AutenticacaoRepository : IAutenticacaoRepository
    {
        private readonly AppDbContext _context;

        public AutenticacaoRepository(AppDbContext context) => _context = context;

        public async Task<Usuario?> ValidarCredenciaisAsync(string login, int statusId)
        {
            return await _context.Usuarios
                .Include(u => u.Status)
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Login == login && u.StatusId != statusId);
        }

        public async Task<Usuario?> ObterUsuarioPorIdAsync(int usuarioId)
        {
            return await _context.Usuarios
                .Include(u => u.Status)
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Id == usuarioId);
        }

        public async Task AdicionarRefreshTokenAsync(RefreshToken token)
        {
            await _context.RefreshTokens.AddAsync(token);
        }

        public async Task<RefreshToken?> ObterRefreshTokenAsync(string token)
        {
            return await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);
        }

        public async Task AtualizarRefreshTokenAsync(RefreshToken token)
        {
            _context.RefreshTokens.Update(token);
        }

        public async Task SalvarAlteracoesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

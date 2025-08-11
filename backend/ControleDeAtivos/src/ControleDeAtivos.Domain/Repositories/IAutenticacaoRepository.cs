using ControleDeAtivos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Domain.Repositories
{
    public interface IAutenticacaoRepository
    {
        Task<Usuario?> ValidarCredenciaisAsync(string login);
        Task<Usuario?> ObterUsuarioPorIdAsync(int usuarioId);

        Task AdicionarRefreshTokenAsync(RefreshToken token);
        Task<RefreshToken?> ObterRefreshTokenAsync(string token);
        Task AtualizarRefreshTokenAsync(RefreshToken token);
        Task SalvarAlteracoesAsync();
    }

}

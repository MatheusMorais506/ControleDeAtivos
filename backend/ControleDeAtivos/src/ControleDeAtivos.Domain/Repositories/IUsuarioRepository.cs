using ControleDeAtivos.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Domain.Repositories
{
    public interface IUsuarioRepository
    {
        Task<List<Usuario>> ObterTodosAsync();
        Task<Usuario> ObterPorIdAsync(int id);
        Task AdicionarAsync(Usuario usuario);
        Task RemoverAsync(Usuario usuario);
        Task AtualizarAsync(Usuario usuario);
        Task SalvarAsync();
    }
}

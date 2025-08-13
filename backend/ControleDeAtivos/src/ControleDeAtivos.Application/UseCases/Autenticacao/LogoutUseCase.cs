using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Requests.Autenticacao;
using ControleDeAtivos.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.UseCases.Autenticacao
{
    public class Logoutservice : ILogoutService
    {
        private readonly IAutenticacaoRepository _autenticacaoRepo;

        public Logoutservice(IAutenticacaoRepository autenticacaoRepo)
        {
            _autenticacaoRepo = autenticacaoRepo;
        }

        public async Task ExecuteAsync(RequestRefreshTokenJson request)
        {
            var token = await _autenticacaoRepo.ObterRefreshTokenAsync(request.RefreshToken);
            if (token != null)
            {
                token.Revogar();
                await _autenticacaoRepo.AtualizarRefreshTokenAsync(token);
                await _autenticacaoRepo.SalvarAlteracoesAsync();
            }
        }
    }
}

using ControleDeAtivos.Api.Requests.Usuario;
using ControleDeAtivos.Application.Interfaces;
using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Interfaces.Usuarios;
using ControleDeAtivos.Domain.Exceptions;
using ControleDeAtivos.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.UseCases.Usuarios
{
    public class AtualizarUsuarioservice : IAtualizarUsuarioService
    {
        private readonly IUsuarioRepository _repo;

        public AtualizarUsuarioservice(
            IUsuarioRepository repo) => _repo = repo;

        public async Task Execute(RequestAtualizarUsuarioJson request)
        {
            var usuario = await _repo.ObterPorIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Usuário não encontrado");

            usuario.Atualizar(
                request.Nome,
                request.Email,
                request.Senha,
                request.Status,
                request.Perfil
            );

            await _repo.AtualizarAsync(usuario);
            await _repo.SalvarAsync();
        }
    }
}

using ControleDeAtivos.Application.Interfaces;
using ControleDeAtivos.Application.Interfaces.Usuarios;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.services.Usuarios
{
    public class ConsultarUsuariosservice : IConsultarUsuarioService
    {
        private readonly IUsuarioRepository _repo;

        public ConsultarUsuariosservice(IUsuarioRepository repo) => _repo = repo;

        public async Task<List<ResponseConsultarUsuarioJson>> ExecuteAsync()
        {
            var usuarios = await _repo.ObterTodosAsync();

            return usuarios.Select(u => new ResponseConsultarUsuarioJson
            {
                Id = u.Id,
                Login = u.Login,
                Nome = u.Nome,
                Email = u.Email,
                Perfil = u.Perfil,
                Status = u.Status,
                DataCadastro = u.DataCadastro
            }).ToList();
        }
    }
}

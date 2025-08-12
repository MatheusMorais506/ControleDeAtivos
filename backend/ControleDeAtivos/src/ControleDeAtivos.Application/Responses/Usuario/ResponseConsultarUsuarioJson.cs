using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Responses.Usuario
{
    public class ResponseConsultarUsuarioJson
    {
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PerfilId { get; set; } = string.Empty;
        public string Perfil { get; set; } = string.Empty;
        public string StatusId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string DataCadastro { get; set; } = string.Empty;
    }
}

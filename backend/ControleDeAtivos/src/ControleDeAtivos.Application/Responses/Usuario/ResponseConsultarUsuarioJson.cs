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
        public Status? Status { get; set; }
        public Perfil? Perfil { get; set; }
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    }
}

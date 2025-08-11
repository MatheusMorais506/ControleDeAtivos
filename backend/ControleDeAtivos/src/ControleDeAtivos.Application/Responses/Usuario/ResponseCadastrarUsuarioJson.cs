using ControleDeAtivos.Domain.Entities;
using ControleDeAtivos.Domain.Enums;

namespace ControleDeAtivos.Application.Responses.Usuario
{
    public class ResponseCadastrarUsuarioJson
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

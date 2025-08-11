using ControleDeAtivos.Domain.Enums;

namespace ControleDeAtivos.Api.Requests.Usuario
{
    public class RequestAtualizarUsuarioJson
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }
        public int Status { get; set; }
        public int Perfil { get; set; }
    }
}

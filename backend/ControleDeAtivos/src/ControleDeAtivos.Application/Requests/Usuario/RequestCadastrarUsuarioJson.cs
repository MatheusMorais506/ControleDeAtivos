using ControleDeAtivos.Domain.Enums;

namespace ControleDeAtivos.Application.Requests.Usuario
{
    public class RequestCadastrarUsuarioJson
    {
        public string Login { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public int StatusId { get; set; }
        public int PerfilId { get; set; }
    }
}

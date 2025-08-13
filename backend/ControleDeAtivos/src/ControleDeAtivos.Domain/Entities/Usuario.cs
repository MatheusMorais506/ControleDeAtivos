namespace ControleDeAtivos.Domain.Entities
{
    public class Usuario
    {
        public int Id { get; private set; }
        public string Login { get; private set; }
        public string Nome { get; private set; }
        public string Email { get; private set; }
        public string? Senha { get; private set; }
        public int StatusId { get; private set; }
        public Status Status { get; private set; }
        public int PerfilId { get; private set; }
        public Perfil Perfil { get; private set; }
        public DateTime DataCadastro { get; set; }

        private Usuario() { }

        public Usuario(
            string login, 
            string nome, 
            string email,
            int statusId,
            int perfilId
        )
        {
            DefinirLogin(login);
            DefinirNome(nome);
            DefinirEmail(email);
            StatusId = statusId;
            PerfilId = perfilId;
            DataCadastro = DateTime.UtcNow;
        }

        public void Atualizar(
            string nome, 
            string email, 
            string senha,
            int statusId,
            int perfilId)
        {
            DefinirNome(nome);
            DefinirEmail(email);
            if (!string.IsNullOrWhiteSpace(senha))
            DefinirSenha(senha);
            StatusId = statusId;
            PerfilId = perfilId;
        }

        public void AtualizarStatus(
            int statusId)
        {
            StatusId = statusId;
        }

        public void DefinirSenha(string senha)
        {
            if (string.IsNullOrWhiteSpace(senha) || senha.Length < 6)
                throw new ArgumentException("" +
                    "A senha deve ter pelo menos 6 caracteres.");
            Senha = BCrypt.Net.BCrypt.HashPassword(senha);
        }

        public bool ValidarSenha(string senha)
        {
            return BCrypt.Net.BCrypt.Verify(senha, Senha);
        }

        public void DefinirLogin(string login)
        {
            if (string.IsNullOrWhiteSpace(login))
                throw new ArgumentException("Login é obrigatório.");
            Login = login;
        }

        public void DefinirNome(string nome)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("Nome é obrigatório.");
            Nome = nome;
        }

        public void DefinirEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
                throw new ArgumentException("E-mail inválido.");
            Email = email;
        }
    }
}

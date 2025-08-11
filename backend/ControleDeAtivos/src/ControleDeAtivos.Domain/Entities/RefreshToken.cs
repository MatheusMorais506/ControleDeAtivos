using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Domain.Entities
{
    public class RefreshToken
    {
        public int Id { get; private set; }
        public string Token { get; private set; }
        public int UsuarioId { get; private set; }
        public DateTime ExpiraEm { get; private set; }
        public bool Revogado { get; private set; }
        public DateTime CriadoEm { get; private set; }

        public RefreshToken(int usuarioId, string token, DateTime expiraEm)
        {
            UsuarioId = usuarioId;
            Token = token;
            ExpiraEm = expiraEm;
            CriadoEm = DateTime.UtcNow;
            Revogado = false;
        }

        public static RefreshToken Gerar(int usuarioId)
        {
            var token = Guid.NewGuid().ToString();
            var expiraEm = DateTime.UtcNow.AddDays(7);

            return new RefreshToken(usuarioId, token, expiraEm);
        }

        public void Revogar()
        {
            Revogado = true;
        }

        public bool EstaValido() => !Revogado && ExpiraEm > DateTime.UtcNow;
    }
}

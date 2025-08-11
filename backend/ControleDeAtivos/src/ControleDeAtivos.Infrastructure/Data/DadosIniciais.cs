using ControleDeAtivos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Infrastructure.Data
{
    public static class DadosIniciais
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            var perfilAdministradorId = 1;
            var perfilBasicoId = 2;
            var statusAtivoId = 1;
            var statusInativoId = 2;
            var usuarioId = 1;

            modelBuilder.Entity<Perfil>().HasData(
                new Perfil { Id = perfilAdministradorId, Descricao = "Administrador" },
                new Perfil { Id = perfilBasicoId, Descricao = "Basico" }
            );

            modelBuilder.Entity<Status>().HasData(
                new Status { Id = statusAtivoId, Descricao = "Ativo" },
                new Status { Id = statusInativoId, Descricao = "Inativo" }
            );

            modelBuilder.Entity<Usuario>().HasData(
                new
                {
                    Id = usuarioId,
                    Login = "admin",
                    Nome = "Administrador",
                    Email = "admin@exemplo.com",
                    Senha = "$2a$11$f8gbWUNwZ6XIOi4uz5BjV.BSLe5i8FYL/klMdGrSQTb62tVmabWUG", //admin10
                    DataCadastro = new DateTime(2025, 8, 12, 0, 0, 0, DateTimeKind.Utc),
                    StatusId = statusAtivoId,
                    PerfilId = perfilAdministradorId
                }
            );

            modelBuilder.Entity<Equipamento>().HasData(
                new { Id = 1, Nome = "Notebook Dell", CodigoIdentificacao = "NB-001", Status = false, NotaEmprestimo = (string?)null },
                new { Id = 2, Nome = "Projetor Epson", CodigoIdentificacao = "PR-002", Status = false, NotaEmprestimo = (string?)null }
            );
        }
    }
}

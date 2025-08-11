using ControleDeAtivos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Equipamento> Equipamentos => Set<Equipamento>();
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Perfil> Perfis => Set<Perfil>();
        public DbSet<Status> Statuses => Set<Status>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Equipamento>(e =>
            {
                e.HasKey(a => a.Id);
                e.Property(a => a.Id).ValueGeneratedOnAdd();
                e.Property(a => a.Nome).IsRequired();
                e.Property(a => a.CodigoIdentificacao).IsRequired();
                e.Property(a => a.Status).IsRequired();
                e.Property(a => a.NotaEmprestimo);
            });

            modelBuilder.Entity<Perfil>(e =>
            {
                e.HasKey(p => p.Id);
                e.Property(p => p.Id).ValueGeneratedOnAdd();
                e.Property(p => p.Descricao);
            });

            modelBuilder.Entity<Status>(e =>
            {
                e.HasKey(s => s.Id);
                e.Property(s => s.Id).ValueGeneratedOnAdd();
                e.Property(s => s.Descricao);
            });

            modelBuilder.Entity<Usuario>(e =>
            {
                e.HasKey(u => u.Id);
                e.Property(u => u.Id).ValueGeneratedOnAdd();
                e.Property(u => u.Login).IsRequired();
                e.Property(u => u.Nome).IsRequired();
                e.Property(u => u.Email).IsRequired();
                e.Property(u => u.Senha);
                e.Property(u => u.DataCadastro).IsRequired();

                e.HasOne(u => u.Status)
                 .WithMany()
                 .HasForeignKey(u => u.StatusId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(u => u.Perfil)
                 .WithMany()
                 .HasForeignKey(u => u.PerfilId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<RefreshToken>(e =>
            {
                e.HasKey(r => r.Id);
                e.Property(r => r.Id).ValueGeneratedOnAdd();
                e.Property(r => r.Token).IsRequired();
                e.Property(r => r.UsuarioId).IsRequired();
                e.Property(r => r.ExpiraEm).IsRequired();
                e.Property(r => r.Revogado).IsRequired();
                e.Property(r => r.CriadoEm).IsRequired();
            });

            // Popular dados de exemplo
            modelBuilder.Seed();
        }
    }
}

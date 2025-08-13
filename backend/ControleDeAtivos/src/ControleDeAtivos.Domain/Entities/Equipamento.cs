using ControleDeAtivos.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Domain.Entities
{
    public class Equipamento
    {
        public int Id { get; private set; }
        public string Nome { get; private set; }
        public string CodigoIdentificacao { get; private set; }
        public bool Status { get; private set; }
        public string? NotaEmprestimo { get; private set; }

        public Equipamento(string nome, string codigoIdentificacao)
        {
            Nome = nome;
            CodigoIdentificacao = codigoIdentificacao;
            Status = false;
        }

        public void RealizarEmprestimo(string nota)
        {
            if (Status) throw new DomainException("Ativo já está em uso.");
            Status = true;
            NotaEmprestimo = nota;
        }

        public void RegistrarDevolucao()
        {
            if (!Status) throw new DomainException("Ativo não está em uso.");
            Status = false;
            NotaEmprestimo = null;
        }

        public void AtualizarDados(string nome, string codigoIdentificacao, string notaEmprestimo)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new DomainException("O nome não pode ser vazio.");

            if (string.IsNullOrWhiteSpace(codigoIdentificacao))
                throw new DomainException("O código de identificação não pode ser vazio.");

            if (!string.IsNullOrWhiteSpace(notaEmprestimo))
            {
                NotaEmprestimo = notaEmprestimo;
            }

            Nome = nome;
            CodigoIdentificacao = codigoIdentificacao;
        }

    }
}

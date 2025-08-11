using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Responses.Equipamento
{
    public class ResponseEquipamentoJson
    {
        public int Id { get; set; }
        public string Nome { get; set; } = null!;
        public string CodigoIdentificacao { get; set; } = null!;
        public bool Status { get; set; }
        public string? NotaEmprestimo { get; set; }

        public ResponseEquipamentoJson(int id, string nome, string codigoIdentificacao, bool status, string? notaEmprestimo)
        {
            Id = id;
            Nome = nome;
            CodigoIdentificacao = codigoIdentificacao;
            Status = status;
            NotaEmprestimo = notaEmprestimo;
        }
    }
}

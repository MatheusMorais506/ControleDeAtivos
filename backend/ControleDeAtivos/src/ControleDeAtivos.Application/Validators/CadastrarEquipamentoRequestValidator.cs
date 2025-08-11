using ControleDeAtivos.Application.Requests.Equipamento;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ControleDeAtivos.Application.Validators
{
    public class CadastrarEquipamentoRequestValidator : AbstractValidator<RequestCadastrarEquipamentoJson>
    {
        public CadastrarEquipamentoRequestValidator()
        {
            RuleFor(x => x.Nome).NotEmpty().WithMessage("Nome é obrigatório");
            RuleFor(x => x.CodigoIdentificacao).NotEmpty().WithMessage("Código é obrigatório");
        }
    }
}

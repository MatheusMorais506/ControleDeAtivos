using ControleDeAtivos.Application.Responses.Usuario;
using FluentValidation;

namespace ControleDeAtivos.Application.Validators
{
    public class CadastrarUsuarioRequestValidator : AbstractValidator<ResponseCadastrarUsuarioJson>
    {
        public CadastrarUsuarioRequestValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email inválido");

            RuleFor(x => x.Login)
                .NotEmpty().WithMessage("Login é obrigatório")
                .MinimumLength(3).WithMessage("Login deve ter pelo menos 3 caracteres")
                .MaximumLength(20).WithMessage("Login deve ter no máximo 20 caracteres");

            RuleFor(x => x.Status)
                .NotNull().WithMessage("Status é obrigatório");

            RuleFor(x => x.Perfil)
                .NotNull().WithMessage("Perfil é obrigatório");
        }
    }
}

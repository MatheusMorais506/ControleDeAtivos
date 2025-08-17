namespace ControleDeAtivos.Application.Requests.Equipamento
{
    public class RequestCadastrarEquipamentoJson
    {
        public string Nome { get; set; } = string.Empty;
        public string CodigoIdentificacao { get; set; } = string.Empty;
        public string NotaEmprestimo { get; set; } = string.Empty;
    }
}

namespace ControleDeAtivos.Application.Responses.Usuario
{
    public class ResponseErrorJson
    {
        public string? Message { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}

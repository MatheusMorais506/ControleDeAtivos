namespace ControleDeAtivos.API.Models
{
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Path { get; set; } = string.Empty;
        public string TraceId { get; set; } = string.Empty;

        public static ErrorResponse FromException(Exception ex, int statusCode, string path, string traceId)
        {
            return new ErrorResponse
            {
                StatusCode = statusCode,
                Message = ex.Message,
                Errors = new List<string> { ex.Message },
                Path = path,
                TraceId = traceId
            };
        }
    }
}

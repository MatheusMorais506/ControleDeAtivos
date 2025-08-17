using ControleDeAtivos.API.Mappers;
using ControleDeAtivos.API.Models;
using ControleDeAtivos.Domain.Exceptions;
using System.Text.Json;

namespace ControleDeAtivos.API.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                switch (ex)
                {
                    case DomainException:
                        _logger.LogWarning(ex, "Erro na requisição {Path}", context.Request.Path);
                        break;
                    case UnauthorizedAccessException:
                        _logger.LogWarning(ex, "Acesso não autorizado na requisição {Path}", context.Request.Path);
                        break;
                    default:
                        _logger.LogError(ex, "Erro inesperado na requisição {Path}", context.Request.Path);
                        break;
                }

                var statusCode = ExceptionStatusCodeMapper.GetStatusCode(ex);

                var errorResponse = ErrorResponse.FromException(
                    ex,
                    statusCode,
                    context.Request.Path,
                    context.TraceIdentifier
                );

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = statusCode;

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = false
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse, options));
            }
        }
    }
}


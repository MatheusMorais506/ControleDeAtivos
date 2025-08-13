using ControleDeAtivos.API.Mappers;
using ControleDeAtivos.API.Models;
using System.Text.Json;

namespace ControleDeAtivos.API.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
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

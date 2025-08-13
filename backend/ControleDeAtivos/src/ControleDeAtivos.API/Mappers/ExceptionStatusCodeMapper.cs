using ControleDeAtivos.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ControleDeAtivos.API.Mappers
{
    public static class ExceptionStatusCodeMapper
    {
        private static readonly Dictionary<Type, int> _map = new()
    {
        { typeof(KeyNotFoundException), StatusCodes.Status404NotFound },
        { typeof(ArgumentException), StatusCodes.Status400BadRequest },
        { typeof(InvalidOperationException), StatusCodes.Status409Conflict },
        { typeof(DomainException), StatusCodes.Status409Conflict },
        { typeof(UnauthorizedAccessException), StatusCodes.Status401Unauthorized },
        { typeof(NotImplementedException), StatusCodes.Status501NotImplemented },
        { typeof(TimeoutException), StatusCodes.Status408RequestTimeout },
        { typeof(HttpRequestException), StatusCodes.Status503ServiceUnavailable },
        { typeof(DbUpdateException), StatusCodes.Status500InternalServerError },
        { typeof(DbUpdateConcurrencyException), StatusCodes.Status409Conflict },
        { typeof(ValidationException), StatusCodes.Status400BadRequest }
    };

        public static int GetStatusCode(Exception ex)
        {
            return _map.TryGetValue(ex.GetType(), out var code)
                ? code
                : StatusCodes.Status500InternalServerError;
        }
    }
}

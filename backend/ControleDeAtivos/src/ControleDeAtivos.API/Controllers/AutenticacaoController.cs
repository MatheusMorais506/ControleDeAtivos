using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Requests.Autenticacao;
using ControleDeAtivos.Application.Requests.Login;
using ControleDeAtivos.Application.Responses.Login;
using ControleDeAtivos.Application.Responses.Usuario;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeAtivos.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacaoController : ControllerBase
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseLoginJson), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login(
            [FromServices] ILoginService service,
            [FromBody] RequestLoginJson request)
        {
            var result = await service.ExecuteAsync(request);
            return Ok(result);
        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(ResponseLoginJson), StatusCodes.Status200OK)]
        public async Task<IActionResult> Refresh(
            [FromServices] IRefreshService service,
            [FromBody] RequestRefreshTokenJson request)
        {
            var result = await service.ExecuteAsync(request);
            return Ok(result);
        }

        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Logout(
            [FromServices] ILogoutService service,
            [FromBody] RequestRefreshTokenJson request)
        {
            await service.ExecuteAsync(request);
            return NoContent();
        }
    }
}

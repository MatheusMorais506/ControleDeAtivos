using ControleDeAtivos.Api.Requests.Usuario;
using ControleDeAtivos.Application.Requests.Usuario;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Application.Interfaces.Usuarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeAtivos.Api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseCadastrarUsuarioJson), StatusCodes.Status201Created)]
        public async Task<IActionResult> Cadastrar(
            [FromServices] ICadastrarUsuarioService service,
            [FromBody] RequestCadastrarUsuarioJson request)
        {
            var result = await service.ExecuteAsync(request);
            return CreatedAtAction(nameof(Cadastrar), new { id = result.Id }, result);
        }

        [HttpGet]
        [ProducesResponseType(typeof(ResponseConsultarUsuarioJson), StatusCodes.Status200OK)]
        public async Task<IActionResult> Consultar(
            [FromServices] IConsultarUsuarioService service
        ) => Ok(await service.ExecuteAsync());

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Atualizar(
            [FromServices] IAtualizarUsuarioService service,
            [FromBody] RequestAtualizarUsuarioJson request)
        {
            await service.Execute(request);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Remover(
            [FromServices] IRemoverUsuarioService service,
            int id)
        {
            await service.ExecuteAsync(id);
            return NoContent();
        }
    }
}

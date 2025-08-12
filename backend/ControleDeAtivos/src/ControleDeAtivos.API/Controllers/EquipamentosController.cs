using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Requests.Equipamento;
using ControleDeAtivos.Application.Responses.Equipamento;
using ControleDeAtivos.Application.services.Equipamentos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeAtivos.Api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EquipamentosController : ControllerBase
    {
        [HttpPost]
        [ProducesResponseType(typeof(ResponseEquipamentoJson), StatusCodes.Status201Created)]
        public async Task<IActionResult> Cadastrar(
       [FromServices] ICadastrarEquipamentoService service,
       [FromBody] RequestCadastrarEquipamentoJson request)
        {
            var result = await service.CadastrarAsync(request.Nome, request.CodigoIdentificacao);
            return CreatedAtAction(nameof(Cadastrar), new { id = result.Id }, result);
        }

        [HttpPut("{id}/atualizar")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Atualizar(
            int id,
            [FromServices] IAtualizarEquipamentoService service,
            [FromBody] RequestCadastrarEquipamentoJson request)
        {
            await service.AtualizarAsync(id, request);
            return NoContent();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<ResponseEquipamentoJson>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Listar(
            [FromServices] IListarEquipamentoService service)
        {
            var result = await service.ListarAsync();
            return Ok(result);
        }

        [HttpPut("{id}/emprestar")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Emprestar(
            int id,
            [FromServices] IEmprestarEquipamentoService service,
            [FromBody] RequestEmprestarEquipamentoJson request)
        {
            await service.EmprestarAsync(id, request.Nota);
            return NoContent();
        }

        [HttpPut("{id}/devolver")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Devolver(
            int id,
            [FromServices] IDevolverEquipamentoService service)
        {
            await service.DevolverAsync(id);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Remover(
            int id,
            [FromServices] IRemoverEquipamentoService service)
        {
            await service.RemoverAsync(id);
            return NoContent();
        }
    }
}

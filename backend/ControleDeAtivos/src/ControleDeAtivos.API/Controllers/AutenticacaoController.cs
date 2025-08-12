using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Requests.Autenticacao;
using ControleDeAtivos.Application.Requests.Login;
using ControleDeAtivos.Application.Responses.Login;
using ControleDeAtivos.Application.Responses.Usuario;
using ControleDeAtivos.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

            Response.Cookies.Append(
                "access_token", result.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,             
                SameSite = SameSiteMode.None, //Strict
                Expires = result.ExpiraEm
            });

            Response.Cookies.Append(
                "refresh_token", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None, //Strict
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                Usuario = result.Usuario
            });
        }

        [HttpPost("refresh")]
        [Authorize]
        [ProducesResponseType(typeof(ResponseLoginJson), StatusCodes.Status200OK)]
        public async Task<IActionResult> Refresh(
            [FromServices] IRefreshService service,
            [FromBody] RequestRefreshTokenJson request)
        {
            var refreshToken = Request.Cookies["refresh_token"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "Refresh token não encontrado" });

            var result = await service.ExecuteAsync(refreshToken);

            Response.Cookies.Append("access_token", result.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,//Strict
                Expires = result.ExpiraEm
            });

            Response.Cookies.Append("refresh_token", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,//Strict
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok();
        }

        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Logout(
            [FromServices] ILogoutService service,
            [FromBody] RequestRefreshTokenJson request)
        {
            await service.ExecuteAsync(request);

            Response.Cookies.Delete("access_token");

            return NoContent();
        }

        [HttpGet]
        [Authorize]
        public IActionResult InformacoesUsuarioLogado()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var emailClaim = User.FindFirst(ClaimTypes.Email);
            var loginClaim = User.FindFirst("Login");
            var nomeClaim = User.FindFirst("Nome");
            var perfilIdClaim = User.FindFirst("PerfilId");
            var perfilClaim = User.FindFirst("Perfil");
            var statusIdClaim = User.FindFirst("StatusId");
            var statusClaim = User.FindFirst("Status");
            var dataCadastroClaim = User.FindFirst("DataCadastro");

            if (idClaim == null)
                return Unauthorized();

            var user = new ResponseConsultarUsuarioJson
            {
                Id = int.Parse(idClaim.Value),
                Email = emailClaim.Value,
                Login = loginClaim.Value,
                Nome = nomeClaim.Value,
                PerfilId = perfilIdClaim.Value.ToString(),
                Perfil = perfilClaim.Value,
                StatusId = statusIdClaim.Value.ToString(),
                Status = statusClaim.Value,
                DataCadastro = dataCadastroClaim.Value
            };

            return Ok(new { usuario = user });
        }
    }
}

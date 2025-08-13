using ControleDeAtivos.Api.Filters;
using ControleDeAtivos.Application.Interfaces.Autenticacao;
using ControleDeAtivos.Application.Interfaces.Equipamentos;
using ControleDeAtivos.Application.Interfaces.Token;
using ControleDeAtivos.Application.Interfaces.Usuarios;
using ControleDeAtivos.Application.UseCases.Autenticacao;
using ControleDeAtivos.Application.UseCases.Equipamentos;
using ControleDeAtivos.Application.UseCases.Usuarios;
using ControleDeAtivos.Application.Validators;
using ControleDeAtivos.Domain.Repositories;
using ControleDeAtivos.Infraestructure.Security;
using ControleDeAtivos.Infrastructure.Data;
using ControleDeAtivos.Infrastructure.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//var contentRoot = builder.Environment.ContentRootPath;
//var solutionRoot = Path.GetFullPath(Path.Combine(contentRoot, "..", ".."));
//var dbPath = Path.Combine(solutionRoot, "database", "ControleDeAtivos.db");
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlite($"Data Source={dbPath}"));

var dbPath = "/database/ControleDeAtivos.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo("/database/DataProtection-Keys"));

builder.Services.AddScoped<IEquipamentoRepository, EquipamentoRepository>();
builder.Services.AddScoped<ICadastrarEquipamentoService, CadastrarEquipamentoservice>();
builder.Services.AddScoped<IListarEquipamentoService, ListarEquipamentoservice>();
builder.Services.AddScoped<IEmprestarEquipamentoService, EmprestarEquipamentoservice>();
builder.Services.AddScoped<IDevolverEquipamentoService, DevolverEquipamentoservice>();
builder.Services.AddScoped<IRemoverEquipamentoService, RemoverEquipamentoservice>();
builder.Services.AddScoped<IAtualizarEquipamentoService, AtualizarEquipamentoservice>();

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ICadastrarUsuarioService, CadastrarUsuarioservice>();
builder.Services.AddScoped<IAtualizarUsuarioService, AtualizarUsuarioservice>();
builder.Services.AddScoped<IConsultarUsuarioService, ConsultarUsuariosservice>();
builder.Services.AddScoped<IRemoverUsuarioService, RemoverUsuarioservice>();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddScoped<IAutenticacaoRepository, AutenticacaoRepository>();
builder.Services.AddScoped<ILoginService, Loginservice>();
builder.Services.AddScoped<ILogoutService, Logoutservice>();
builder.Services.AddScoped<IRefreshService, RefreshTokenservice>();

var allowedOrigins = new string[]
{
    "http://localhost:3000",
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddMvcOptions(options =>
    {
        options.Filters.Add(typeof(FluentValidationFilter));
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Controle de Ativos", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Insira o token JWT no campo abaixo. Exemplo: 'Bearer {seu_token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

builder.Services.AddValidatorsFromAssemblyContaining<CadastrarEquipamentoRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CadastrarUsuarioRequestValidator>();


var key = builder.Configuration["Jwt:ChaveSecreta"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("access_token"))
                {
                    context.Token = context.Request.Cookies["access_token"];
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

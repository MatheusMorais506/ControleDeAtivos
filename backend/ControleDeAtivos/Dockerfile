# ===== Etapa de Build =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Instala certificados e utilitários para HTTPS
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl gnupg && \
    update-ca-certificates

# Copia solução e projetos
COPY ControleDeAtivos.sln ./
COPY src ./src
COPY tests ./tests

COPY NuGet.Config ./

# Restaura dependências sem paralelismo
RUN dotnet restore ControleDeAtivos.sln --disable-parallel

# Publica a aplicação
RUN dotnet publish src/ControleDeAtivos.API/ControleDeAtivos.API.csproj -c Release -o /publish /p:UseAppHost=false

# ===== Etapa de Runtime =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copia arquivos publicados da etapa de build
COPY --from=build /publish ./

# Expõe a porta da aplicação
EXPOSE 5000

# Executa a aplicação
ENTRYPOINT ["dotnet", "ControleDeAtivos.API.dll"]

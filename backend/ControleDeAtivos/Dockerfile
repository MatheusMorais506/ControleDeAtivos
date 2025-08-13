# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia a solução e os projetos
COPY ControleDeAtivos.sln ./
COPY src ./src
COPY tests ./tests

# Restaura dependências
RUN dotnet restore ControleDeAtivos.sln

# Publica o projeto principal para uma pasta chamada /publish
RUN dotnet publish src/ControleDeAtivos.API/ControleDeAtivos.API.csproj -c Release -o /publish /p:UseAppHost=false

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copia os arquivos publicados da etapa de build
COPY --from=build /publish ./

# Expõe a porta
EXPOSE 5000

# Executa a aplicação
ENTRYPOINT ["dotnet", "ControleDeAtivos.API.dll"]
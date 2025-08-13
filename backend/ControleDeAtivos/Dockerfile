FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo de solução
COPY ControleDeAtivos.sln ./

# Copia cada projeto mantendo a estrutura original
COPY src ./src

# Restaura dependências
RUN dotnet restore ControleDeAtivos.sln

# Copia o restante (se houver arquivos extras)
# COPY . .

# Publica
RUN dotnet publish ControleDeAtivos.sln -c Release -o /app

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 5000
ENTRYPOINT ["dotnet", "ControleDeAtivos.dll"]

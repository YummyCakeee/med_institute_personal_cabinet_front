FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /qumicon-hub
EXPOSE 80

# Copy everything
COPY . ./
# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /qumicon-hub
COPY --from=build-env /qumicon-hub/out .
ENTRYPOINT ["dotnet", "qumicon-hub.dll"]

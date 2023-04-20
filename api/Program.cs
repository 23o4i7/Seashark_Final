using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;

using api.Models;
using api.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = "Host=db-postgresql-sfo3-63693-do-user-13331464-0.b.db.ondigitalocean.com;Port=25060;Database=final;Username=doadmin;Password=AVNS_Ic1nESmRZjN5OUvnTK3;IncludeErrorDetail=true";
builder.Services.AddDbContext<DatabaseContext>(
    opt =>
    {
        opt.UseNpgsql(connectionString);
        if (builder.Environment.IsDevelopment())
        {
            opt
              .LogTo(Console.WriteLine, LogLevel.Information)
              .EnableSensitiveDataLogging()
              .EnableDetailedErrors();
        }
    }
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
app.UseRouting();

app.MapControllers();
app.MapHub<ShareHub>("/r/sharehub");
app.MapGet("/", () => "Hello World!");

app.Run();

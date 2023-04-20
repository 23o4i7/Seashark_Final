using Microsoft.EntityFrameworkCore;

namespace api.Models;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cuisine>()
            .HasMany(m => m.Dishes)
            .WithOne(c => c.Cuisine)
            .HasForeignKey(m => m.CuisineId)
            .IsRequired();
    }
    
    public DbSet<Cuisine> Cuisines => Set<Cuisine>();
    public DbSet<Dish> Dishes => Set<Dish>();
}
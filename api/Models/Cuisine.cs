using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

public class Cuisine
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Region { get; set; }
    public string Description { get; set; }
    public ICollection<Dish>? Dishes { get; set; }
}
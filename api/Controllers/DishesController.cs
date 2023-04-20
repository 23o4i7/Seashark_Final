using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Text.Json;

using api.Models;
using api.Hubs;

namespace api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly DatabaseContext _context;

    private readonly IHubContext<ShareHub> _hub;

    public DishesController(DatabaseContext context, IHubContext<ShareHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Dish>>> GetDishes()
    {
        return await _context.Dishes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<IResult> GetDish(int id)
    {
        var dish = await _context.Dishes.Include(d => d.Cuisine).FirstOrDefaultAsync(i => i.Id == id);

        if (dish == null)
        {
            return Results.NotFound();
        }

        return Results.Json(dish, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            ReferenceHandler = ReferenceHandler.IgnoreCycles
        });
    }

    [HttpPost]
    public async Task<ActionResult<Dish>> PostDish(Dish dish)
    {
        var existingDish = await _context.Dishes.FirstOrDefaultAsync(c => c.Name == dish.Name);
        if (existingDish != null)
        {
            return Conflict();
        }

        _context.Dishes.Add(dish);
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("CreatedDish", dish);

        return CreatedAtAction("GetDish", new { id = dish.Id }, dish);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutDish(int id, Dish dish)
    {
        if (id != dish.Id)
        {
            return BadRequest();
        }

        _context.Entry(dish).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DishExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        await _hub.Clients.All.SendAsync("UpdatedDish", dish);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDish(int id)
    {
        var dish = await _context.Dishes.FindAsync(id);
        if (dish == null)
        {
            return NotFound();
        }

        _context.Dishes.Remove(dish);
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("DeletedDish", dish);

        return NoContent();
    }

    private bool DishExists(int id)
    {
        return _context.Dishes.Any(e => e.Id == id);
    }
}
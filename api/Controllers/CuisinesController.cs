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
public class CuisinesController : ControllerBase
{
    private readonly DatabaseContext _context;

    private readonly IHubContext<ShareHub> _hub;

    public CuisinesController(DatabaseContext context, IHubContext<ShareHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cuisine>>> GetCuisines()
    {
        return await _context.Cuisines.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<IResult> GetCuisine(int id)
    {
        var cuisine = await _context.Cuisines.Include(d => d.Dishes).FirstOrDefaultAsync(i => i.Id == id);

        if (cuisine == null)
        {
            return Results.NotFound();
        }

        return Results.Json(cuisine, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            ReferenceHandler = ReferenceHandler.IgnoreCycles
        });
    }

    [HttpPost]
    public async Task<IActionResult> PostCuisine(Cuisine cuisine)
    {
        var existingCuisine = await _context.Cuisines.FirstOrDefaultAsync(c => c.Name == cuisine.Name);
        if (existingCuisine != null)
        {
            return Conflict();
        }

        _context.Cuisines.Add(cuisine);
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("CreatedCuisine", cuisine);

        return CreatedAtAction("GetCuisine", new { id = cuisine.Id }, cuisine);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCuisine(int id, Cuisine cuisine)
    {
        if (id != cuisine.Id)
        {
            return BadRequest();
        }

        _context.Entry(cuisine).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CuisineExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        await _hub.Clients.All.SendAsync("UpdatedCuisine", cuisine);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Cuisine>> DeleteCuisine(int id)
    {
        var cuisine = await _context.Cuisines.FindAsync(id);
        if (cuisine == null)
        {
            return NotFound();
        }

        _context.Cuisines.Remove(cuisine);
        await _context.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("DeletedCuisine", cuisine);

        return Ok();
    }

    private bool CuisineExists(int id)
    {
        return _context.Cuisines.Any(e => e.Id == id);
    }
}
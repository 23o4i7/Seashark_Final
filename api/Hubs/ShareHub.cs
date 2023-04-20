using Microsoft.AspNetCore.SignalR;

namespace api.Hubs;

public class ShareHub : Hub
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine("A Client Connected: " + Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        Console.WriteLine("A client disconnected: " + Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    public async Task CreateCuisine(string cuisine)
    {
        await Clients.All.SendAsync("CreatedCuisine", cuisine);
    }

    public async Task UpdateCuisine(string cuisine)
    {
        await Clients.All.SendAsync("UpdatedCuisine", cuisine);
    }

    public async Task DeleteCuisine(string cuisine)
    {
        await Clients.All.SendAsync("DeletedCuisine", cuisine);
    }

    public async Task CreateDish(string dish)
    {
        await Clients.All.SendAsync("CreatedDish", dish);
    }

    public async Task UpdateDish(string dish)
    {
        await Clients.All.SendAsync("UpdatedDish", dish);
    }

    public async Task DeleteDish(string dish)
    {
        await Clients.All.SendAsync("DeletedDish", dish);
    }
}

using hub.Models;
using Microsoft.AspNetCore.SignalR;

namespace hub.Hub;

public class Hub : Microsoft.AspNetCore.SignalR.Hub
{
    /// <summary>
    /// Send message to all clients in the room
    /// </summary>
    /// <param name="message">message to send</param>
    /// <param name="sender">sender name</param>
    /// <param name="roomId">room id</param>
    public async Task SendMessage(string message, string sender, string roomId)
    {
        await Clients.Group(roomId).SendAsync(Actions.ReceiveMessage, message, sender);
    }

    /// <summary>
    /// Joined the room
    /// </summary>
    /// <param name="roomId">room id to join</param>
    public async Task JoinedRoom(string roomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }

    /// <summary>
    /// Left the room
    /// </summary>
    /// <param name="roomId">room id to leave</param>
    public async Task LeftRoom(string roomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
    }

    /// <summary>
    /// Room created notification
    /// </summary>
    public async Task RoomsUpdated()
    {
        await Clients.Others.SendAsync(Actions.UpdateRooms);
    }

    /// <summary>
    /// When somebody's started sharing screen
    /// </summary>
    /// <param name="roomId">room id</param>
    /// <param name="publisherId">publisher id that started screen sharing</param>
    public async Task ScreenSharingUpdated(string roomId, string? publisherId = null)
    {
        Console.WriteLine("Room " + roomId + " publisher " + publisherId);
        await Clients.Group(roomId).SendAsync(Actions.UpdateScreenSharingPublisher, publisherId);
    }
}
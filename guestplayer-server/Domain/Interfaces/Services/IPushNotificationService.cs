using Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IPushNotificationService
    {
        Task Register(RegisterForPushParams registerParams);
        Task Unregister(string partyId, string userId);
        Task Send<TData>(SendPushParams<TData> parameters);
    }
}

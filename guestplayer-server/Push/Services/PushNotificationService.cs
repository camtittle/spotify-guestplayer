using Domain.DTOs;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces.Respoitories;
using Domain.Interfaces.Services;
using Push.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using WebPush;

namespace Push.Services
{
    class PushNotificationService : IPushNotificationService
    {

        private readonly IPartyRepository _partyRepository;
        private readonly WebPushClient _webPushClient;

        public PushNotificationService(IPartyRepository partyRepository, WebPushClient webPushClient)
        {
            _partyRepository = partyRepository;
            _webPushClient = webPushClient;
        }

        public async Task Register(RegisterForPushParams registerParams)
        {
            var party = await _partyRepository.GetParty(registerParams.PartyId);
            if (party == null)
            {
                throw new NotFoundException();
            }

            if (party.Ended)
            {
                throw new PartyEndedException();
            }

            var pushSubscription = new Domain.Entities.PushSubscription()
            {
                UserId = registerParams.UserId,
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
                Endpoint = registerParams.Endpoint,
                Keys = new Domain.Entities.Keys()
                {
                    Auth = registerParams.Auth,
                    P256dh = registerParams.P256dh
                }
            };

            // If it's the host
            if (party.Host.UserId == registerParams.UserId)
            {
                party.Host.PushSubscription = pushSubscription;
            } else
            // If it's a cohost
            {
                var cohost = party.Cohosts.Find(x => x.UserId == registerParams.UserId);
                if (cohost == null)
                {
                    throw new PushSubscriptionException("Only hosts and cohosts can register for push");
                }

                cohost.PushSubscription = pushSubscription;
            }

            await _partyRepository.PutParty(party);
        }

        public async Task Unregister(string partyId, string userId)
        {
            var party = await _partyRepository.GetParty(partyId);

            if (party == null)
            {
                throw new NotFoundException();
            }

            if (party.Ended)
            {
                throw new PartyEndedException();
            }

            // If it's the host
            if (party.Host.UserId == userId)
            {
                party.Host.PushSubscription = null;
            }
            else
            // If it's a cohost
            {
                var cohost = party.Cohosts.Find(x => x.UserId == userId);
                if (cohost == null)
                {
                    // No subscription found for this user, return
                    return;
                }

                cohost.PushSubscription = null;
            }

            await _partyRepository.PutParty(party);
        }

        public async Task Send<TData>(SendPushParams<TData> parameters)
        {
            var notification = new PushNotification<TData>()
            {
                Type = parameters.Type,
                Data = parameters.Data
            };

            var subscription = parameters.PushSubscription;
            var webPushSubscription = new PushSubscription(subscription.Endpoint, subscription.Keys.P256dh, subscription.Keys.Auth);
            var options = new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
            await _webPushClient.SendNotificationAsync(webPushSubscription, JsonSerializer.Serialize(notification, options));
        }
    }
}

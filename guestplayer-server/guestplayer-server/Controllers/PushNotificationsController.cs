using Domain.DTOs;
using Domain.Enums;
using Domain.Interfaces.Services;
using guestplayer_server.Helpers;
using guestplayer_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PushNotificationsController : Controller
    {

        private readonly IPushNotificationService _pushNotificationService;

        public PushNotificationsController(IPushNotificationService pushNotificationService)
        {
            _pushNotificationService = pushNotificationService;
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Host, Role.Cohost)]
        public async Task<ActionResult> Register(RegisterForPushNotificationsRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var userId = HttpContext.GetUserId();
            var partyId = HttpContext.GetPartyId();

            var parameters = new RegisterForPushParams()
            {
                PartyId = partyId,
                UserId = userId,
                Endpoint = request.Subscription.Endpoint,
                Auth = request.Subscription.Keys.Auth,
                P256dh = request.Subscription.Keys.P256dh
            };

            await _pushNotificationService.Register(parameters);

            return NoContent();
        }

        [HttpPost("unregister")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Host, Role.Cohost)]
        public async Task<ActionResult> Unregister()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var userId = HttpContext.GetUserId();
            var partyId = HttpContext.GetPartyId();

            await _pushNotificationService.Unregister(partyId, userId);

            return NoContent();
        }
    }
}

using Domain.Enums;
using guestplayer_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly List<Role> _roles;

    public AuthorizeAttribute(Role role)
    {
        _roles = new List<Role>(new []{ role });
    }

    public AuthorizeAttribute(params Role[] roles)
    {
        _roles = new List<Role>(roles);
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var partyId = (string)context.HttpContext.Items[ContextItem.PartyId];
        var role = (Nullable<Role>)context.HttpContext.Items[ContextItem.Role];
        if (partyId == null || role == null)
        {
            // Unauthorized
            context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
        } else if (!_roles.Contains((Role)role))
        {
            // Forbidden
            context.Result = new JsonResult(new { message = "Forbidden" }) { StatusCode = StatusCodes.Status403Forbidden };
        }
    }
}
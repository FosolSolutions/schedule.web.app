using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Scheduler.Helpers;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Scheduler.Controllers
{
	[Route("[controller]")]
	public class AuthController : Controller
	{
		#region Variables
		private readonly IApiClient _apiClient;
		#endregion

		#region Constructors
		public AuthController(IApiClient apiClient, IConfiguration configuration)
		{
			_apiClient = apiClient;
		}
		#endregion

		#region Endpoints
		[Route("signout")]
		[Authorize]
		public IActionResult SignOut()
		{
			return SignOut(CookieAuthenticationDefaults.AuthenticationScheme);
		}

		[HttpPost("authenticate")]
		public async Task<IActionResult> Authenticate(string email, string password)
		{
			try
			{
				var message = await _apiClient.PostAsJsonAsync<TokenMessage>("/bearer/authenticate", new { email, password });

				var identity = new ClaimsIdentity("CoEvent");
				identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, message.Id.ToString()));
				identity.AddClaim(new Claim(ClaimTypes.Email, message.Email));
				identity.AddClaim(new Claim("token", message.Token));
				var user = new ClaimsPrincipal(identity);

				await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, user);

				return RedirectToAction("GetUser", "Api", new { id = message.Id });
			}
			catch (ApiException)
			{
				return Unauthorized();
			}
		}

		[HttpPost("authenticate/{key}")]
		public async Task<IActionResult> Authenticate(Guid key)
		{
			try
			{
				var message = await _apiClient.PostAsJsonAsync<TokenMessage>($"/bearer/authenticate/{key}", null);

				var identity = new ClaimsIdentity("CoEvent");
				identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, message.Id.ToString()));
				identity.AddClaim(new Claim(ClaimTypes.Email, message.Email));
				identity.AddClaim(new Claim("token", message.Token));
				var user = new ClaimsPrincipal(identity);

				await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, user);

				return RedirectToAction("GetParticipant", "Api", new { id = message.Id });
			}
			catch (ApiException)
			{
				return Unauthorized();
			}
		}

		[HttpGet("identity")]
		public async Task<IActionResult> Identity()
		{
			var message = await _apiClient.GetAsJsonAsync<object>("/auth/current/identity");

			return Json(message);
		}
		#endregion
	}

	class TokenMessage
	{
		#region Properties
		public int Id { get; set; }
		public string Email { get; set; }
		public string Token { get; set; }
		#endregion
	}
}

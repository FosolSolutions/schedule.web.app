using Microsoft.AspNetCore.Mvc;
using Scheduler.Helpers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Scheduler.Controllers
{
	[Route("[controller]")]
	public class ApiController : Controller
	{
		#region Variables
		private readonly IApiClient _apiClient;
		#endregion

		#region Constructors
		public ApiController(IApiClient apiClient)
		{
			_apiClient = apiClient;
		}
		#endregion

		#region Endpoints
		#region Manage
		[HttpGet("manage/participant/{id}", Name = nameof(GetParticipant))]
		public async Task<IActionResult> GetParticipant(int id)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/manage/participant/{id}");
			return Json(message);
		}

		[HttpGet("manage/user/{id}", Name = nameof(GetUser))]
		public async Task<IActionResult> GetUser(int id)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/manage/user/{id}");
			return Json(message);
		}
		#endregion

		#region Data
		[HttpGet("data/calendars")]
		public async Task<IActionResult> GetCalendars()
		{
			var message = await _apiClient.GetAsJsonAsync<object>("/data/calendars");
			return Json(message);
		}

		[HttpGet("data/calendar/{id}")]
		public async Task<IActionResult> GetCalendar(int id)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/data/calendar/{id}");
			return Json(message);
		}

		[HttpGet("data/calendar/event/{id}")]
		public async Task<IActionResult> GetEvent(int id)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/data/calendar/event/{id}");
			return Json(message);
		}

		[HttpGet("data/calendar/{id}/events")]
		public async Task<IActionResult> GetEvents(int id, DateTime startOn, DateTime endOn)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/data/calendar/{id}/events?starton={startOn}&endon={endOn}");
			return Json(message);
		}

		[HttpGet("data/calendar/event/activity/{id}")]
		public async Task<IActionResult> GetActivity(int id)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/data/calendar/event/activity/{id}");
			return Json(message);
		}

		[HttpGet("data/calendar/{id}/activities")]
		public async Task<IActionResult> GetActivities(int id, DateTime startOn, DateTime endOn)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/data/calendar/{id}/activities?starton={startOn}&endon={endOn}");
			return Json(message);
		}

		[HttpGet("data/calendar/event/activity/opening/{id}")]
		public async Task<IActionResult> GetOpening(int id)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/data/calendar/event/activity/opening/{id}");
			return Json(message);
		}

		[HttpGet("data/calendar/{id}/openings")]
		public async Task<IActionResult> GetOpenings(int id, DateTime startOn, DateTime endOn)
		{
			var message = await _apiClient.GetAsJsonAsync<object>($"/data/calendar/{id}/openings?starton={startOn}&endon={endOn}");
			return Json(message);
		}

		[HttpPut("data/calendar/event/activity/opening/apply")]
		public async Task<IActionResult> Apply([FromBody] OpeningApplicationModel model)
		{
			var message = await _apiClient.PutAsJsonAsync<object>($"/data/calendar/event/activity/opening/apply", model);
			return Json(message);
		}

		[HttpPut("data/calendar/event/activity/opening/unapply")]
		public async Task<IActionResult> Unapply([FromBody] OpeningModel model)
		{
			var message = await _apiClient.PutAsJsonAsync<object>($"/data/calendar/event/activity/opening/unapply", model);
			return Json(message);
		}
		#endregion
		#endregion
	}

	public class OpeningModel
	{
		public int Id { get; set; }
		public string RowVersion { get; set; }
	}

	public class OpeningApplicationModel
	{
		public int OpeningId { get; set; }
		public string RowVersion { get; set; }
		public IList<AnswerModel> Answers { get; set; }
	}

	public class AnswerModel
	{
		public int QuestionId { get; set; }
		public string Text { get; set; }
	}
}

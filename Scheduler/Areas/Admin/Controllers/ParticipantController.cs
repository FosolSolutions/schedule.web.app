using Microsoft.AspNetCore.Mvc;

namespace Scheduler.Areas.Admin.Controllers
{
	[Area("admin")]
	[Route("[area]/[controller]")]
	public class ParticipantController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
using Microsoft.AspNetCore.Mvc;

namespace Scheduler.Areas.Schedule.Controllers
{
	[Area("schedule")]
	[Route("[area]/[controller]")]
	public class HomeController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
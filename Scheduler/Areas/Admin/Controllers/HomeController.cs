using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Scheduler.Areas.Admin.Controllers
{
	[Area("admin")]
	[Route("[area]/[controller]")]
	public class HomeController : Controller
	{
		[HttpGet("")]
		public async Task<IActionResult> Index()
		{
			return View();
		}
	}
}
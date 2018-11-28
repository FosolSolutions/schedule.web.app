﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Scheduler.Areas.Admin.Controllers
{
	[Area("admin")]
	[Route("[area]/[controller]")]
	public class CalendarController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
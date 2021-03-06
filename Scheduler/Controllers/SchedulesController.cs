using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Models;

namespace Scheduler.Controllers
{
    public class SchedulesController : Controller
    {
        [Route("schedules")]
        [Route("schedules/{name}")]
        public IActionResult Schedules()
        {
            ViewData["relativePath"] = Request.Path.Value;
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

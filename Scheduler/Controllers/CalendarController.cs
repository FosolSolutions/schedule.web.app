using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Models;

namespace Scheduler.Controllers
{
    public class CalendarController : Controller
    {
        [Route("calendar")]
        public IActionResult Calendar()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

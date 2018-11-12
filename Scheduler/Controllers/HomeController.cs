using Microsoft.AspNetCore.Mvc;

namespace Scheduler.Controllers
{
    public class HomeController : Controller
    {
        [Route("")]
        public IActionResult Index()
        {
            return View();
        }
    }
}

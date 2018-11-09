using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Scheduler.Models;
using System.Diagnostics;
using System.Net;

namespace Scheduler.Controllers
{
    /// <summary>
    /// ErrorController class, provides endpoints to handle general HTTP request endpiont errors.
    /// </summary>
    [Route("[controller]")]
    public class ErrorController : Controller
    {
        #region Variables
        //private readonly JsonErrorHandler _errorHandler;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an ErrorController object.
        /// </summary>
        /// <param name="errorHandler"></param>
        public ErrorController()//JsonErrorHandler errorHandler)
        {
            //_errorHandler = errorHandler;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// A default page to view different types of errors.
        /// </summary>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        [HttpGet("{statusCode?}")]
        public IActionResult Index(int? statusCode = null)
        {
            var feature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            //var model = _errorHandler.Wrap(feature?.Error, statusCode.HasValue ? (HttpStatusCode)statusCode.Value : HttpStatusCode.InternalServerError);
            switch (statusCode)
            {
                case ((int)HttpStatusCode.NotFound):
                    return View("404-NotFound");
                case ((int)HttpStatusCode.Unauthorized): // Not Authenticated.
                    return View("401-Unauthorized");
                case ((int)HttpStatusCode.Forbidden): // Not Authorized to perform action.
                    return View("403-Forbidden");
                case ((int)HttpStatusCode.InternalServerError):
                default:
                    return View();//model);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        #endregion
    }
}

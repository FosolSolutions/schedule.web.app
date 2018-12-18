using System;
using System.Net;

namespace Scheduler.Helpers
{
	public class ApiException : Exception
	{
		#region Properties
		public HttpStatusCode StatusCode { get; set; }

		public object Content { get; set; }
		#endregion

		#region Constructors
		public ApiException(HttpStatusCode statusCode, string message) : base(message)
		{
			this.StatusCode = statusCode;
		}

		public ApiException(HttpStatusCode statusCode, object content) : base()
		{
			this.Content = content;
		}
		#endregion
	}
}

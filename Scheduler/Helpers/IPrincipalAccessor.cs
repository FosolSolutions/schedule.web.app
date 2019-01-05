using System.Security.Claims;

namespace Scheduler.Helpers
{
	public interface IPrincipalAccessor
	{
		#region Properties
		ClaimsPrincipal Principal { get; }
		#endregion
	}
}

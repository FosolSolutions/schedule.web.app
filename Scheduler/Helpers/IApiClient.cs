using System;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Scheduler.Helpers
{
	public interface IApiClient : IDisposable
	{
		JsonSerializerSettings Settings { get; }

		Task<T> DeleteAsJsonAsync<T>(string uri, object value, CancellationToken cancellationToken = default(CancellationToken));
		Task<T> DeleteAsync<T>(string uri, CancellationToken cancellationToken = default(CancellationToken));
		Task<string> DeleteAsync(string uri, CancellationToken cancellationToken = default(CancellationToken));
		Task<T> DeleteAsync<T>(string uri, string value, CancellationToken cancellationToken = default(CancellationToken));
		Task<string> GetAsync(string uri, CancellationToken cancellationToken = default(CancellationToken));
		Task<T> GetAsJsonAsync<T>(string uri, CancellationToken cancellationToken = default(CancellationToken));
		Task<string> PostAsync(string uri, object value, CancellationToken cancellationToken = default(CancellationToken));
		Task<T> PostAsJsonAsync<T>(string uri, object value, CancellationToken cancellationToken = default(CancellationToken));
		Task<string> PutAsync(string uri, object value, CancellationToken cancellationToken = default(CancellationToken));
		Task<T> PutAsJsonAsync<T>(string uri, object value, CancellationToken cancellationToken = default(CancellationToken));
	}
}
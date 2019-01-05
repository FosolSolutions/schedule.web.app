using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Scheduler.Helpers
{
	public class ApiClient : IApiClient
	{
		#region Variables
		private readonly HttpClient _client;
		#endregion

		#region Properties
		public JsonSerializerSettings Settings { get; }

		public string Uri { get; }
		#endregion

		#region Constructors
		public ApiClient(IPrincipalAccessor principalAccessor, IConfiguration configuration, IOptions<MvcJsonOptions> options)
		{
			if (principalAccessor == null) throw new ArgumentNullException(nameof(principalAccessor));

			this.Settings = options?.Value?.SerializerSettings;
			_client = new HttpClient();
			if (principalAccessor.Principal is ClaimsPrincipal)
			{
				var bearer = principalAccessor.Principal?.Claims.FirstOrDefault(c => c.Type == "token");
				if (bearer != null) _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", bearer?.Value);
			}
			this.Uri = configuration["Api:Uri"];
		}
		#endregion

		#region Methods
		private async Task<string> HandleResponse(HttpResponseMessage message, CancellationToken cancellationToken)
		{
			using (var content = message.Content)
			{
				if (message.IsSuccessStatusCode)
				{
					var result = await content.ReadAsStringAsync();
					return result;
				}
				else if (content != null)
				{
					var error = await content.ReadAsStringAsync();
					throw new ApiException(message.StatusCode, error);
				}
			}

			throw new ApiException(message.StatusCode, message.ReasonPhrase);
		}

		private async Task<T> HandleResponse<T>(HttpResponseMessage message, CancellationToken cancellationToken)
		{
			using (var content = message.Content)
			{
				if (message.IsSuccessStatusCode)
				{
					var result = await content.ReadAsAsync<T>(cancellationToken);
					return result;
				}
				else if (content != null)
				{
					var error = await content.ReadAsStringAsync();
					throw new ApiException(message.StatusCode, error);
				}
			}

			throw new ApiException(message.StatusCode, message.ReasonPhrase);
		}

		public async Task<string> GetAsync(string endpoint, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.GetAsync($"{this.Uri}{endpoint}", cancellationToken))
			{
				return await HandleResponse(response, cancellationToken);
			}
		}

		public async Task<T> GetAsJsonAsync<T>(string endpoint, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.GetAsync($"{this.Uri}{endpoint}", cancellationToken))
			{
				return await HandleResponse<T>(response, cancellationToken);
			}
		}

		public async Task<string> PostAsync(string endpoint, object value, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.PostAsJsonAsync($"{this.Uri}{endpoint}", value, cancellationToken))
			{
				return await HandleResponse(response, cancellationToken);
			}
		}

		public async Task<T> PostAsJsonAsync<T>(string endpoint, object value, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.PostAsJsonAsync($"{this.Uri}{endpoint}", value, cancellationToken))
			{
				return await HandleResponse<T>(response, cancellationToken);
			}
		}

		public async Task<string> PutAsync(string endpoint, object value, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.PutAsJsonAsync($"{this.Uri}{endpoint}", value, cancellationToken))
			{
				return await HandleResponse(response, cancellationToken);
			}
		}

		public async Task<T> PutAsJsonAsync<T>(string endpoint, object value, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.PutAsJsonAsync($"{this.Uri}{endpoint}", value, cancellationToken))
			{
				return await HandleResponse<T>(response, cancellationToken);
			}
		}

		public async Task<string> DeleteAsync(string endpoint, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.DeleteAsync($"{this.Uri}{endpoint}", cancellationToken))
			{
				return await HandleResponse(response, cancellationToken);
			}
		}

		public async Task<T> DeleteAsync<T>(string endpoint, CancellationToken cancellationToken = new CancellationToken())
		{
			using (var response = await _client.DeleteAsync($"{this.Uri}{endpoint}", cancellationToken))
			{
				return await HandleResponse<T>(response, cancellationToken);
			}
		}

		public async Task<T> DeleteAsync<T>(string endpoint, string value, CancellationToken cancellationToken = new CancellationToken())
		{
			var request = new HttpRequestMessage(HttpMethod.Delete, $"{this.Uri}{endpoint}")
			{
				Content = new StringContent(value)
			};
			using (var response = await _client.SendAsync(request, cancellationToken))
			{
				return await HandleResponse<T>(response, cancellationToken);
			}
		}

		public async Task<T> DeleteAsJsonAsync<T>(string endpoint, object value, CancellationToken cancellationToken = new CancellationToken())
		{
			var json = JsonConvert.SerializeObject(value, this.Settings);
			var request = new HttpRequestMessage(HttpMethod.Delete, $"{this.Uri}{endpoint}")
			{
				Content = new StringContent(json)
			};
			using (var response = await _client.SendAsync(request, cancellationToken))
			{
				return await HandleResponse<T>(response, cancellationToken);
			}
		}

		public void Dispose()
		{
			_client?.Dispose();
		}
		#endregion
	}
}
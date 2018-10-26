using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Scheduler
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((webHostBuilderContext, config) =>
                {
                    var environment = webHostBuilderContext.HostingEnvironment;
                    config.AddJsonFile("appsettings.json", optional: false);
                    config.AddJsonFile("appsettings.{environment}.json", optional: true);
                    config.AddEnvironmentVariables();
                })
                .UseStartup<Startup>();
    }
}

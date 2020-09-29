using System;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DatingApp.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            //DataContext'i parametre olarak gönderdikten sonra ondan kurtulmak istiyoruz. O yüzden using kullanırız.
            using(var scope = host.Services.CreateScope()){ // to use CreateScope() method import Microsoft.Extensions.DependencyInjection;
                var services = scope.ServiceProvider;
                //Bu metod main metod olduğundan ve ilk çalıştırılıcak metod olduğundan burada bir exception handling middleware yok bu yüzden try-catch kullanırız.
                try
                {
                    var context = services.GetRequiredService<DataContext>(); //DataContext'i parametre olarak göndereceğimiz için alırız.
                    context.Database.Migrate();// bu komut yardımı ile her dotnet run/watch run yaptığımızda databasei kontrol edip update 
                    //edilmemiş migrations varsa update eder. Bizim ayrıca dotnet ef database update yapmamıza gerek yok artık.
                    Seed.SeedUsers(context);
                } 
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occured during migration");   
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}

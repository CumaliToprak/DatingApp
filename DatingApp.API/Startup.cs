using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x =>
            x.UseSqlite(Configuration.GetConnectionString("DefaultConnection"))); //"ConnectionString just placeholder for now.
            services.AddControllers().AddNewtonsoftJson(opt =>
            {
                opt.SerializerSettings.ReferenceLoopHandling =
                Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            services.AddCors(); //this is gonna make Cors service available. so that we can use this as a middleware. 
                                // Ordering is not important here.
            services.AddAutoMapper(typeof(DatingRepository).Assembly);  //1-Bu satrı nereye yazdığımız önemli değil bu scope içerisinde. 2-AutoMapper profilinin oluşturulacağı assemblynin yerini parametre olrak vermeliyiz.
            services.AddScoped<IAuthRepository, AuthRepository>(); //injection of AuthRepository and IAuthRepository
            services.AddScoped<IDatingRepository, DatingRepository>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true, // to check our key is valid.
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8 //SymmetricSecurityKey wants the key as a byte array. for that reaseos we converted.
                            .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false, //our Issuer localhost
                        ValidateAudience = false  //our Audience localhost as well.
                    };
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) //development modda bu blok çalışır.
            {
                app.UseDeveloperExceptionPage();
            }
            else
            { //Global Exception handler eklemek için. Bu bizi hata yakalamak için bir sürü kod yazmaktan kurtarır. .net core bziim için tüm hataları global olarka handle eder. Development mode harici modlarda exception oluştuğunda bu blok çalışır.örn: Production mod.
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; //to use HttpStatusCode import using System.Net
                        var error = context.Features.Get<IExceptionHandlerFeature>(); // to use IExceptionHandlerFeature import Microsoft.AspNetCore.Hosting;
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message); //oluşturduğumuz helper class yardımı ile responsa yeni header ekledik.
                            await context.Response.WriteAsync(error.Error.Message); //To use WriteAsync import Microsoft.AspNetCore.Http -> Bu satir hata mesajlarını http 
                                                                                    //responsa yazar.
                        }
                    });
                });
            }

            // app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); //ordering is important here. it must be between them. 
                                                                                    //inside method parameter we defined cors policy expression.
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

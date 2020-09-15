using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
            x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")) ); //"ConnectionString just placeholder for now.
            services.AddControllers(); 
            services.AddCors(); //this is gonna make Cors service available. so that we can use this as a middleware. 
                                // Ordering is not important here.
            services.AddScoped<IAuthRepository, AuthRepository>(); //injection of AuthRepository and IAuthRepository
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters{
                        ValidateIssuerSigningKey  = true, // to check our key is valid.
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
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
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

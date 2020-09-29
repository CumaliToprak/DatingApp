using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extensions //Extension metodları içerecek class. Nesne örneğini oluşturmamak için static olarak tanımladık.
    {
        public static void AddApplicationError(this HttpResponse response, string message){ //to override http response : this HttpResponse response 
            //reponse(global exception handler tarafından gönderilen response) a yeni header eklemek istediğimiz için:
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*"); //*: is a wildcard(joker) = yani tüm originlere izin ver demek.

        }

        public static int CalculateAge(this DateTime theDateTime){
             var age = DateTime.Today.Year - theDateTime.Year;
             return age;
        }
        
    }
}
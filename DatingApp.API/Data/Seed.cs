using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any()) //Hiç kullanıcı var mı?
            { //to use Any() method import using.linq
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);  //to user JsonConvert import Newtonsoft.Json
                foreach (var user in users)
                {   
                    byte[]  passwordHash, passwordSalt;
                    CreatePasswordHash("password",out passwordHash,out passwordSalt); //passwordların hepsinin değeri password old. direkt yazdık.

                    user.PasswordHash = passwordHash;
                    user.PasswordSalt = passwordSalt;
                    user.Username = user.Username.ToLower();
                    context.Users.Add(user);
                }
                    context.SaveChanges(); //asyn olarak yapmaya gerek yok çünkü program çalışmaya başladığında ilk olarak burası çalışcak.
            }

        }


        //Bu metodu AuthRepository classından getirdik.
        //Bu metodu sadece burda kullanacağımız için AuthRepositoryde public yapmadık.
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }
    }
}
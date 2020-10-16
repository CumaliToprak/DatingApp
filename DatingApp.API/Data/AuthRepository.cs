using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context) //to inject DataContext to this class.
        {
            _context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Username == username);//if it does not find return null.

            if(user == null) //username eşleşmezse
                return null;

            if(!VerifyPasswordHash(password,user.PasswordSalt, user.PasswordHash)) //password eşleşmezse
            return null;

            return user;

            
       }

        private bool VerifyPasswordHash(string password, byte[] passwordSalt, byte[] passwordHash)
        {  
              //to get the same hashed password while login, used randomly generated key(passwordSalt)
             using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for(int i=0 ; i<passwordHash.Length; i++)
                {
                    if(passwordHash[i]!=computedHash[i])  return false;
                }
            }

            return true;

        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;

        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }

        public async Task<bool> UserExists(string username)
        {
           
            if(await _context.Users.AnyAsync(x => x.Username == username))    return true;

            return false;
        }
    }
}
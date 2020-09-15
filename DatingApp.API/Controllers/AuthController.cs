using System;
using System.IdentityModel.Tokens.Jwt; // to use JwtSecurityTokenHandler class.
using System.Security.Claims; //to use Claim class while creatin authantication token.
using System.Text; // To use 'Encoding' at line 64
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // to use IConfiguration interface in the constructor
using Microsoft.IdentityModel.Tokens; // to use SymmetricSecurityKey class.

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]  //means  ->  /api/Auth routes to AuthController
    [ApiController]   //attribute
    public class AuthController : ControllerBase //A base class for an MVC controller without view, we use angular for view implementation
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)// Burdaki parametreyi daha önce AuthRepository yaptığımdan çalışmamıştı. Dikkat!
        {
            _config = config;
            _repo = repo;
        }


        [HttpPost("register")]
        //we will refactor parameter type later on. Because the parameter will come in json format.
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();


            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exists"); // to use this method we have to implemet controllerbase class to this controller.
            //for Register method get user object. we create user object.
            var userToCreate = new User
            {
                Username = userForRegisterDto.Username
            };

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201); //we will refactor this later on.

        }

        [HttpPost("login")]

        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (userFromRepo == null)  //ıf the user dosent exist in db it return null.
                return Unauthorized();


            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),  //token string old. ToString() yaptık.
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value)); //we store the key in the AppSetting.Json file
                                                                                                                    //.Value is used to get the value of this token
            //encrypting the key using hashing algorithm                                                                  
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1), //expire date is a day. It is just for training course purposes.
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new {
                token = tokenHandler.WriteToken(token)
            });
        }



    }
}
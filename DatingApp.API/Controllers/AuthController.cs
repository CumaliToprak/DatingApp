using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]  //means  ->  /api/Auth routes to AuthController
    [ApiController]   //attribute
    public class AuthController : ControllerBase //A base class for an MVC controller without view, we use angular for view implementation
    {
        private readonly AuthRepository _repo;
        public AuthController(AuthRepository repo)
        {
            _repo = repo;
        }


        [HttpPost("register")]
        //we will refactor parameter type later on. Because the parameter will come in json format.
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto) 
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();


            if(await _repo.UserExists(userForRegisterDto.Username)) 
                return BadRequest("Username already exists"); // to use this method we have to implemet controllerbase class to this controller.
            //for Register method get user object. we create user object.
            var userToCreate = new User{
                Username = userForRegisterDto.Username
            };

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);
            
            return StatusCode(201); //we will refactor this later on.

        }    


    }
}
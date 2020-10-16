using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DatingApp.API.Data;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Dtos;
using System.Collections.Generic;
using System.Security.Claims;
using System;

namespace DatingApp.API.Controllers
{
    // Bu metodlara, verilere ulaşacak kişiler yetkiye sahip olmalı
    [Authorize] //to use import: Microsoft.AspNetCore.Authorization;
    [Route("api/[Controller]")] //Bu spesicif controllera ulaşmak için bu yapıyı kullanırız. bu route bizi : api/users'a yönlendirir.
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper) //Burda concrete class reposunu değil interface repoyu çağırıyoruz. Dikkat!
        {
            _mapper = mapper; //mapper servis objesi
            _repo = repo;
        }

        [HttpGet] //when request to 'localhost:5000/api/Users bu metod çalışır.
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating user {id} failed on save");
        }


    }
}
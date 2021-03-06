using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext //it is derived from Microsoft.EntityFrameworkCore; Need to include the library. 
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; } // Values represents table name.
        public DbSet<User> Users { get; set; } //Users represent User table name
        public DbSet<Photo> Photos { get; set; }
    }
}



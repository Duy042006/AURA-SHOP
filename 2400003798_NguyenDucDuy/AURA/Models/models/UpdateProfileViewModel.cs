using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class UpdateProfileViewModel
    {
        public int UserId { get; set; }
        public string HoTen { get; set; }      // ánh xạ FullName
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
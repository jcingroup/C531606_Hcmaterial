using DotWeb.Controller;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.Areas.Base.Controllers
{
    public class FAQController : AdminController
    {
        // GET: Base/FAQ
        public ActionResult Index()
        {
            return View("FAQ");
        }
    }
}
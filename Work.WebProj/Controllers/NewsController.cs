﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.WebApp.Controllers
{
    public class NewsController : WebUserController
    {
        // GET: News
        public ActionResult Index()
        {
            return View("list");
        }
        public ActionResult content()
        {
            return View();
        }
        public ActionResult content2()
        {
            return View();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.WebApp.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            return View("Battery_intro");
        }
        // 正極材料
        public ActionResult Battery()
        {
            return View();
        }
        public ActionResult Battery2()
        {
            return View();
        }
        public ActionResult Battery3()
        {
            return View();
        }
        // 核心技術
        public ActionResult Technology()
        {
            return View();
        }
        // 市場趨勢
        public ActionResult Trend()
        {
            return View();
        }
        // 鋰電池組成
        public ActionResult Build()
        {
            return View();
        }
    }
}
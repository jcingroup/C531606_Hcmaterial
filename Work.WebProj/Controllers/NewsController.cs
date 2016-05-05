using System;
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
            db0 = getDB0();
            var items = db0.News.ToList();

            foreach (var item in items)
            {
                item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
            }

            return View("list",items);
        }
        public ActionResult content(int id)
        {
            db0 = getDB0();
            var item = db0.News.Find(id);
            if (item == null)
            {
                return Redirect("~/NoID.html");
            }
            else {

                item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
                return View(item);
            }
        }
        public ActionResult content2()
        {
            return View();
        }
    }



}
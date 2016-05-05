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
        public ActionResult Index()
        {
            db0 = getDB0();
            var items = db0.News.Where(x => x.state == "A").OrderByDescending(x => x.set_date).ToList();

            foreach (var item in items)
            {
                item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
            }

            return View("list", items);
        }
        public ActionResult content(int id)
        {
            db0 = getDB0();
            var item = db0.News.Find(id);
            if (item == null)
            {
                return Redirect("~/NoID.html");
            }
            else
            {
                if (item.state != "A") {
                    return Redirect("~/NoID.html");
                }
                item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
                return View(item);
            }
        }
        public ActionResult content2()
        {
            return View();
        }
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
            Response.Redirect("~/NoID.html");
        }
    }
}
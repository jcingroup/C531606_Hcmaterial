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

            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            var items = db0.News.Where(x => x.state == "A" && x.i_Lang == lang).OrderByDescending(x => x.set_date).ToList();

            foreach (var item in items)
            {
                item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
            }

            return View("list", items);
        }

        [HandleError]
        public ActionResult content(int id)
        {

            db0 = getDB0();
            var item = db0.News.Find(id);
            if (item == null)
                return View("Error");

            item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
            return View(item);

        }
        public ActionResult content2()
        {
            return View();
        }

        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
            filterContext.Result = new ViewResult()
            {
                ViewName = "Error"
            };
            filterContext.ExceptionHandled = true;
        }
    }
}
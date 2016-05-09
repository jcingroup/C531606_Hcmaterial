using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class IndexController : WebUserController
    {
        public ActionResult Index()
        {
            db0 = getDB0();

            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            var items = db0.News.Where(x => x.state == "A" && x.i_Lang == lang)
                .OrderByDescending(x => x.set_date)
                .Take(3)
                .ToList();

            foreach (var item in items)
            {
                item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
            }

            return View("Index", items);
        }

        public RedirectResult Login()
        {
            return Redirect("~/Base/Login");
        }
    }

}

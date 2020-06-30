using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.WebCore;

namespace DotWeb.WebApp.Controllers
{
    public class NewsController : WebUserController
    {
        public ActionResult Index(int? c_id, int? q_page)
        {
            db0 = getDB0();
            NewsList md = new NewsList();
            var lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            md.category = db0.NewsCategory.Where(x => x.state == "A" && x.i_Lang == lang).OrderByDescending(x => x.sort).ToList();
            md.list = db0.News.Where(x => x.state == "A" && x.i_Lang == lang).OrderByDescending(x => x.set_date).ToList();

            #region 過濾分類
            ProcCore.Business.DB0.NewsCategory category_data = null;
            if (c_id != null)
                category_data = db0.NewsCategory.Where(x => x.state == "A" && x.i_Lang == lang && x.news_category_id == c_id).FirstOrDefault();

            if (category_data != null)
            {
                md.list = md.list.Where(x => x.news_category_id == category_data.news_category_id).ToList();
                ViewBag.c_id = category_data.news_category_id;
            }
            #endregion
            #region 分頁設定
            int defPageSize = 10;
            int page = (q_page == null ? 1 : (int)q_page);
            var resultCount = md.list.Count();
            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            md.list = md.list
              .OrderByDescending(x => x.set_date)
              .Skip(startRecord)
              .Take(defPageSize)
              .ToList();
            md.total = PageCount.TotalPage;
            md.page = PageCount.Page;
            md.records = PageCount.RecordCount;
            md.startcount = PageCount.StartCount;
            md.endcount = PageCount.EndCount;
            #endregion

            foreach (var item in md.list)
            {
                item.img_list = ImgSrc("Active", "NewsData", item.news_id, "List", "origin");
            }

            return View("list", md);
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

        public class NewsList
        {
            public IList<ProcCore.Business.DB0.NewsCategory> category { get; set; }
            public IList<ProcCore.Business.DB0.News> list { get; set; }

            public int total { get; set; }
            public int page { get; set; }
            public int records { get; set; }
            public int startcount { get; set; }
            public int endcount { get; set; }
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
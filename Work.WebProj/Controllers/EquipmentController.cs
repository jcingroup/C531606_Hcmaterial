using DotWeb.Controller;
using System.Web.Mvc;

namespace DotWeb.WebApp.Controllers
{
    public class EquipmentController : WebUserController
    {
        // GET: Equipment
        public ActionResult Index()
        {
            return View("Equipment");
        }

        // 2021 new add 設備
        // 噴霧乾燥機
        public ActionResult Equipment()
        {
            return View();
        }

        // 臥式砂磨機
        [Route("Equipment/2")]
        public ActionResult Equipment2()
        {
            return View();
        }

        // 相關項目
        [Route("Equipment/other")]
        public ActionResult Equipment_other()
        {
            return View();
        }
    }
}
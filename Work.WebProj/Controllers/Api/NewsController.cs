using Microsoft.AspNet.Identity.EntityFramework;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using LinqKit;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;

namespace DotWeb.Api
{
    public class NewsController : ajaxApi<News, q_News>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                News item = await db0.News.FindAsync(id);
                var r = new ResultInfo<News>() { data = item };
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]q_News q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            db0 = getDB0();
            var predicate = PredicateBuilder.True<News>();

            if (q.title != null)
                predicate = predicate.And(x => x.news_title.Contains(q.title));

            if (q.i_Lang != null)
                predicate = predicate.And(x => x.i_Lang == q.i_Lang);

            int page = (q.page == null ? 1 : (int)q.page);
            var result = db0.News.AsExpandable().Where(predicate);
            var resultCount = await result.CountAsync();

            int startRecord = PageCount.PageInfo(page, defPageSize, resultCount);
            var resultItems = await result
                .OrderByDescending(x => x.news_id)
                .Skip(startRecord)
                .Take(defPageSize)
                .ToListAsync();

            db0.Dispose();

            return Ok(new
            {
                rows = resultItems,
                total = PageCount.TotalPage,
                page = PageCount.Page,
                records = PageCount.RecordCount,
                startcount = PageCount.StartCount,
                endcount = PageCount.EndCount
            });

            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]News md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.News.FindAsync(md.news_id);
                item.news_title = md.news_title;
                item.news_content = md.news_content;
                item.set_date = md.set_date;
                item.state = md.state;
                item.i_Lang = md.i_Lang;
                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]News md)
        {
            md.news_id = GetNewId(CodeTable.Base);

            //md.i_InsertDateTime = DateTime.Now;
            //md.i_InsertDeptID = departmentId;
            //md.i_InsertUserID = UserId;
            //md.i_Lang = "zh-TW";
            r = new ResultInfo<News>();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.News.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.news_id;
                return Ok(r);
                #endregion
            }
            catch (DbEntityValidationException ex) //欄位驗證錯誤
            {
                r.message = getDbEntityValidationException(ex);
                r.result = false;
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message + "\r\n" + getErrorMessage(ex);
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]int[] ids)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<News>();
                foreach (var id in ids)
                {
                    item = new News() { news_id = id };
                    db0.News.Attach(item);
                    db0.News.Remove(item);
                }
                await db0.SaveChangesAsync();

                r.result = true;
                return Ok(r);
            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist
                        + "\r\n" + getErrorMessage(ex);
                }
                else
                {
                    r.message = ex.Message;
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
    }
    public class q_News : QueryBase
    {
        public string title { set; get; }
        public string i_Lang { get; set; }

    }
}

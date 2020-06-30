using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(NewsCategoryMetadata))]
    public partial class NewsCategory
    {
        private class NewsCategoryMetadata
        {
            [JsonIgnore]
            public virtual ICollection<News> News { get; set; }
        }
    }
}


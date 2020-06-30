using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(NewsMetadata))]
    public partial class News
    {

        public string img_list { get; set; }

        private class NewsMetadata
        {
            [JsonIgnore]
            public virtual NewsCategory NewsCategory { get; set; }
        }
    }
}


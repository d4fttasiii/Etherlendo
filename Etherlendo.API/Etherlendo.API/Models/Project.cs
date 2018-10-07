using ElasticSearchLite.NetCore.Interfaces;

namespace Etherlendo.API.Models
{
    public class Project : IElasticPoco
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Index { get; set; }
        public double? Score { get; set; }
        public long Total { get; set; }
        public long Version { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string ContractAddress { get; set; }
        public string Image { get; set; }
    }
}

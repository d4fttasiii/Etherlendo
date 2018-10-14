using ElasticSearchLite.NetCore;
using ElasticSearchLite.NetCore.Queries;
using Etherlendo.API.Models;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace Etherlendo.API.Services
{
    public class ProjectService
    {
        private readonly ElasticLiteClient _client;
        private const string IndexName = "projectindex";
        private const string TypeName = "project";

        public ProjectService(IOptions<Settings> options)
        {
            _client = new ElasticLiteClient(options.Value.ElasticSearchAddress);
        }

        public IEnumerable<Project> GetAll() =>
            Search.In(IndexName)
                  .Return<Project>()
                  .ExecuteWith(_client);

        public Project Get(string id) =>
            ElasticSearchLite.NetCore.Queries.Get.FromIndex(IndexName)
                .Return<Project>(TypeName)
                .ById(id)
                .ExecuteWith(_client);

        public string Put(Project project)
        {
            Index.Document(project).ExecuteWith(_client);

            return project.Id;
        }
    }
}

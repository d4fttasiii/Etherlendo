using Etherlendo.API.Models;
using Etherlendo.API.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Etherlendo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectService _service;

        public ProjectController(ProjectService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Project>> GetAll()
        {
            try
            {
                var projects = _service.GetAll();

                return Ok(projects);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet("{id}")]
        public ActionResult<Project> Get(string id)
        {
            try
            {
                var project = _service.Get(id);

                return Ok(project);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

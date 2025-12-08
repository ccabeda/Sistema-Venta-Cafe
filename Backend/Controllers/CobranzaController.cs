using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;

namespace SistemaDeVentasCafe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CobranzaController : Controller
    {
        private readonly IServiceGeneric<CobranzaUpdateDto, CobranzaCreateDto> _service;
        public CobranzaController(IServiceGeneric<CobranzaUpdateDto, CobranzaCreateDto> service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Listar")]
        [ProducesResponseType(StatusCodes.Status200OK)] //documentación
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Listar()
        {
            var result = await _service.Listar();
            return Utilidades.AyudaControlador(result);
        }

        [HttpGet]
        [Route("Consultar/{idCobranza:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> Consultar(int idCobranza)
        {
            var result = await _service.ObtenerPorId(idCobranza);
            return Utilidades.AyudaControlador(result);
        }

        [HttpPost]
        [Route("Registrar")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Registrar([FromBody] CobranzaCreateDto cliente)
        {
            var result = await _service.Crear(cliente);
            return Utilidades.AyudaControlador(result);
        }

        [HttpPut]
        [Route("Modificar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Modificar([FromBody] CobranzaUpdateDto cliente)
        {
            var result = await _service.Actualizar(cliente);
            return Utilidades.AyudaControlador(result);
        }

        [HttpDelete]
        [Route("Anular/{idCobranza:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Anular(int idCobranza)
        {
            var result = await _service.Eliminar(idCobranza);
            return Utilidades.AyudaControlador(result);
        }
    }
}

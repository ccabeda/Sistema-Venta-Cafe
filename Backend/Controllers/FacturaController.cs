using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;
using SistemaDeVentasCafe.Service;

namespace SistemaDeVentasCafe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : Controller
    {
        private readonly IServiceFactura _service;

        public FacturaController(IServiceFactura service)
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
        [Route("Consultar/{idFactura:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> Consultar(int idFactura)
        {
            var result = await _service.ObtenerPorId(idFactura);
            return Utilidades.AyudaControlador(result);
        }

        [HttpPost]
        [Route("Registrar")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Registrar([FromBody] FacturaCreateDto facturaCreateDto)
        {
            var result = await _service.Crear(facturaCreateDto);
            return Utilidades.AyudaControlador(result);
        }

        [HttpGet]
        [Route("Imprimir/{idFactura:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> Imprimir(int idFactura)
        {
            var result = await ((ServiceFactura)_service).Imprimir(idFactura);
            return Utilidades.AyudaControlador(result);
        }
    }
}

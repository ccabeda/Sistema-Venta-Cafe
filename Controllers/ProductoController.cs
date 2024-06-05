using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;

namespace SistemaDeVentasCafe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly IServiceGeneric<ProductoUpdateDto, ProductoCreateDto> _service;
        public ProductoController(IServiceGeneric<ProductoUpdateDto, ProductoCreateDto> service)
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
        [Route("Consultar/{idProducto:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<APIResponse>> Consultar(int idProducto)
        {
            var result = await _service.ObtenerPorId(idProducto);
            return Utilidades.AyudaControlador(result);
        }

        [HttpPost]
        [Route("Registrar")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Registrar([FromBody] ProductoCreateDto producto)
        {
            var result = await _service.Crear(producto);
            return Utilidades.AyudaControlador(result);
        }

        [HttpPut]
        [Route("Modificar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Modificar([FromBody] ProductoUpdateDto producto)
        {
            var result = await _service.Actualizar(producto);
            return Utilidades.AyudaControlador(result);
        }

        [HttpDelete]
        [Route("Anular/{idProducto:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> Anular(int idProducto)
        {
            var result = await _service.Eliminar(idProducto);
            return Utilidades.AyudaControlador(result);
        }
    }
}

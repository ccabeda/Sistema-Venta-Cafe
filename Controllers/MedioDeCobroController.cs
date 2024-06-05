using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.Models;
using QRCoder;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Service.IService;
using SistemaDeVentasCafe.CodigoRepetido;

namespace SistemaDeVentasCafe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedioDeCobroController : Controller
    {
        private readonly IServiceMedioDePago _service;
        public MedioDeCobroController(IServiceMedioDePago service)
        {
            _service = service;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Route("RegistrarCobroConCodigoQR")]
        public async Task<ActionResult<APIResponse>> codigoQR([FromBody] QRCreateDto QR) 
        {
            var result = await _service.PagarConQR(QR);
            return Utilidades.AyudaControlador(result);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Route("RegistrarCobroConTarjetaDeDebito")]
        public async Task<ActionResult<APIResponse>> tarjetaDebito([FromBody] MedioDePagoCreateDto tarjeta)
        {
            var result = await _service.PagarConDebito(tarjeta);
            return Utilidades.AyudaControlador(result);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Route("RegistrarCobroConTarjetaDeCredito")]
        public async Task<ActionResult<APIResponse>> tarjetaCredito([FromBody] MedioDePagoCreateDto tarjeta)
        {
            var result = await _service.PagarConCredito(tarjeta);
            return Utilidades.AyudaControlador(result);
        }
    }
}

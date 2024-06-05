using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;

namespace SistemaDeVentasCafe.Service.IService
{
    public interface IServiceMedioDePago
    {
        public Task<APIResponse> PagarConQR([FromBody] QRCreateDto QR);
        public Task<APIResponse> PagarConCredito([FromBody] MedioDePagoCreateDto tarjeta);
        public Task<APIResponse> PagarConDebito([FromBody] MedioDePagoCreateDto trajeta);
    }
}

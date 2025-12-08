using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;

namespace SistemaDeVentasCafe.Service.IService
{
    public interface IServiceFactura
    {
        public Task<APIResponse> Listar();
        public Task<APIResponse> ObtenerPorId(int id);
        public Task<APIResponse> Crear([FromBody] FacturaCreateDto facturaCreateDto);
        public Task<APIResponse> Imprimir(int id);
    }
}

using AutoMapper;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;

namespace SistemaDeVentasCafe
{
    public class AutomapperConfig : Profile
    {
        public AutomapperConfig()
        {
            //configuración
            CreateMap<Cliente, ClienteCreateDto>().ReverseMap();
            CreateMap<Cliente, ClienteUpdateDto>().ReverseMap();
            CreateMap<Producto, ProductoCreateDto>().ReverseMap();
            CreateMap<Producto, ProductoUpdateDto>().ReverseMap();
            CreateMap<Factura, FacturaCreateDto>().ReverseMap();
            CreateMap<Factura, FacturaGetDto>().ReverseMap();
            CreateMap<Cobranza,  CobranzaCreateDto>().ReverseMap();
            CreateMap<Cobranza, CobranzaUpdateDto>().ReverseMap();
            CreateMap<Mediodepago, MedioDePagoCreateDto>().ReverseMap();
        }
    }
}
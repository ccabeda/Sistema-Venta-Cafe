using SistemaDeVentasCafe.Models;

namespace SistemaDeVentasCafe.DTOs
{
    public record FacturaCreateDto(int IdCliente,
                                   ICollection<Facturaproducto> Lista_De_Productos);
}

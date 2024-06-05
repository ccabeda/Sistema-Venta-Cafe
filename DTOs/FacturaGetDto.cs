namespace SistemaDeVentasCafe.DTOs
{
    public record FacturaGetDto(int IdFactura,
                                   int CantidadProductos,
                                   string Descripcion,
                                   decimal PrecioTotal,
                                   int IdCliente,
                                   bool EstadoPago);
}


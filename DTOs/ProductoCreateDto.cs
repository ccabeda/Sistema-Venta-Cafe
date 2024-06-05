namespace SistemaDeVentasCafe.DTOs
{
    public record ProductoCreateDto(string Descripcion,
                                    decimal PrecioVenta,
                                    int StockActual,
                                    int NumeroDeLote,
                                    DateOnly FechaVencimiento);

}

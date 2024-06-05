namespace SistemaDeVentasCafe.DTOs
{
    public record ProductoUpdateDto(int IdProducto,
                                    string Descripcion,
                                    decimal PrecioVenta,
                                    int StockActual,
                                    int NumeroDeLote,
                                    DateOnly FechaVencimiento);
}

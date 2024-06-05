namespace SistemaDeVentasCafe.DTOs
{
    public record CobranzaUpdateDto(int IdCobranza,
                                    string Descripcion,
                                    decimal importe,
                                    int NumeroFactura,
                                    int MedioDePago);
 
}

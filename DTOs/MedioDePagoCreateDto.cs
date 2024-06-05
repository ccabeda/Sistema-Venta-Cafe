namespace SistemaDeVentasCafe.DTOs
{
    public record MedioDePagoCreateDto(int NumeroDeTarjeta,
                                       DateOnly FechaDeCaducidad,
                                       int CodigoDeSeguridad,
                                       string Nombre,
                                       string Apellido,
                                       string Localidad,
                                       string DireccionDeFacturacion,
                                       string Pais,
                                       int Telefono);
}

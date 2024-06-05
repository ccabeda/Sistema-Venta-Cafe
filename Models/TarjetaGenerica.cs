namespace SistemaDeVentasCafe.Models;

public partial class TarjetaGenerica
{
    public int NumeroDeTarjeta { get; set; }
    public DateOnly? FechaDeCaducidad { get; set; }
    public int? CodigoDeSeguridad { get; set; }
    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public string? Localidad { get; set; }
    public string? DireccionDeFacturacion { get; set; }
    public string? Pais { get; set; }
    public int? Telefono { get; set; }
}

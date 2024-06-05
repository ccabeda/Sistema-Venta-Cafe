using System.Text.Json.Serialization;

namespace SistemaDeVentasCafe.Models;

public partial class Cobranza
{
    public int IdCobranza { get; set; }
    public string? Descripcion { get; set; }
    public decimal? Importe { get; set; }
    public DateOnly? FechaDeCobro { get; set; }
    public int NumeroFactura { get; set; }
    public int MedioDePago { get; set; }
    [JsonIgnore]
    public virtual Mediodepago? MedioDePagoNavigation { get; set; }
    [JsonIgnore]
    public virtual Factura? NumeroFacturaNavigation { get; set; }
}

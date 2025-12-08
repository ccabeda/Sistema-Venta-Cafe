namespace SistemaDeVentasCafe.DTOs
{
    public record ClienteUpdateDto(int IdCliente,
                                   int Dni,
                                   string Nombre,
                                   string Apellido,
                                   int Telefono,
                                   string CorreoElectronico);
}

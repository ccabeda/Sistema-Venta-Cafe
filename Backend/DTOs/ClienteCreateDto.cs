namespace SistemaDeVentasCafe.DTOs
{
    public record ClienteCreateDto(int Dni,
                                   string Nombre,
                                   string Apellido,
                                   int Telefono,
                                   string CorreoElectronico);

}

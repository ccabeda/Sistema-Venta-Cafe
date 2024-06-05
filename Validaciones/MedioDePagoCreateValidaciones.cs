using FluentValidation;
using SistemaDeVentasCafe.DTOs;

namespace SistemaDeVentasCafe.Validaciones
{
    public class MedioDePagoCreateValidaciones : AbstractValidator<MedioDePagoCreateDto>
    {
        public MedioDePagoCreateValidaciones()
        {
            RuleFor(a => a.Nombre).NotEmpty().WithMessage("El nombre no puede estar vacio.");
            RuleFor(a => a.Apellido).NotEmpty().WithMessage("El apellido no puede estar vacio.");
            RuleFor(a => a.Localidad).NotEmpty().WithMessage("La localidad no puede estar vacia.");
            RuleFor(a => a.Pais).NotEmpty().WithMessage("El país no puede estar vacio.");
            RuleFor(a => a.Telefono).NotEmpty().WithMessage("El teléfono no puede estar vacio.");
            RuleFor(a => a.FechaDeCaducidad).NotEmpty().WithMessage("La fecha de caducidad no puede estar vacia.");
            RuleFor(a => a.CodigoDeSeguridad).NotEmpty().WithMessage("El codigo de seguridad no puede estar vacio.");
            RuleFor(a => a.NumeroDeTarjeta).NotEmpty().WithMessage("El número de tarjeta no puede estar vacio.");
        }
    }
}

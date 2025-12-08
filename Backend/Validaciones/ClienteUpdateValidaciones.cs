using FluentValidation;
using SistemaDeVentasCafe.DTOs;

namespace SistemaDeVentasCafe.Validaciones
{
    public class ClienteUpdateValidaciones : AbstractValidator<ClienteUpdateDto>
    {
        public ClienteUpdateValidaciones()
        {
            RuleFor(a => a.Nombre).NotEmpty().WithMessage("El nombre no puede estar vacio.");
            RuleFor(a => a.Apellido).NotEmpty().WithMessage("El apellido no puede estar vacio.");
            RuleFor(a => a.Dni).NotEmpty().WithMessage("El DNI no puede estar vacio.");
            RuleFor(a => a.CorreoElectronico).EmailAddress().WithMessage("El mail no es valido.");
            RuleFor(a => a.Telefono).NotEmpty().WithMessage("El teléfono no puede estar vacio.");
        }
    }
}

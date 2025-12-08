using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;
using SistemaDeVentasCafe.UnitOfWork;

namespace SistemaDeVentasCafe.Service
{
    public class ServiceMedioDePago : IServiceMedioDePago
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly APIResponse _apiresponse;
        private readonly ILogger<ServiceMedioDePago> _logger;

        public ServiceMedioDePago(IMapper mapper, APIResponse apiresponse, ILogger<ServiceMedioDePago> logger, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _apiresponse = apiresponse;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        public async Task<APIResponse> PagarConCredito([FromBody] MedioDePagoCreateDto tarjeta)
        {
            try
            {
                var cod = _mapper.Map<Mediodepago>(tarjeta);
                cod.Descripcion = "Pago Realizado con Tarjeta De Credito.";
                await _unitOfWork.repositoryMedioDePago.Crear(cod);
                await _unitOfWork.Save();
                return Utilidades.CreatedResponse(_apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> PagarConDebito([FromBody] MedioDePagoCreateDto tarjeta)
        {
            try
            {
                var cod = _mapper.Map<Mediodepago>(tarjeta);
                cod.Descripcion = "Pago Realizado con Tarjeta De Debito.";
                await _unitOfWork.repositoryMedioDePago.Crear(cod);
                await _unitOfWork.Save();
                return Utilidades.CreatedResponse(_apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> PagarConQR(int id)
        {
            try
            {
                var cliente = await _unitOfWork.repositoryCliente.ObtenerPorId(id);
                if (cliente == null)
                {
                    _logger.LogError("No existe cliente con ese id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                Mediodepago cod = new();
                cod.Nombre = cliente.Nombre;
                cod.Apellido = cliente.Apellido;
                cod.Telefono = cliente.Telefono;
                cod.Descripcion = "Pago Realizado con Codigo QR.";
                await _unitOfWork.repositoryMedioDePago.Crear(cod);
                await _unitOfWork.Save();
                return Utilidades.GeneradorQR(_apiresponse, cod.Descripcion);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }
    }
}

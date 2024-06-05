using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;
using SistemaDeVentasCafe.UnitOfWork;

namespace SistemaDeVentasCafe.Service
{
    public class ServiceCobranza : IServiceGeneric<CobranzaUpdateDto, CobranzaCreateDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly APIResponse _apiresponse;
        private readonly ILogger<ServiceCobranza> _logger;
        public ServiceCobranza(IMapper mapper, APIResponse apiresponse, ILogger<ServiceCobranza> logger, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _apiresponse = apiresponse;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        public async Task<APIResponse> Listar()
        {
            try
            {
                List<Cobranza> lista = await _unitOfWork.repositoryCobranza.ListarTodos();
                if (lista.Count == 0)
                {
                    _logger.LogError("La lista de cobranzas esta vacia.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Lista de cobranzas traida con exito.");
                return Utilidades.ListOKResponse(lista, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> ObtenerPorId(int id)
        {
            try
            {
                var cobranza = await _unitOfWork.repositoryCobranza.ObtenerPorId(id);
                if (cobranza == null)
                {
                    _logger.LogError("No existe cobranza con ese id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("cobranza traida con exito.");
                return Utilidades.OKResponse(cobranza, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        //Hay que hacer que al momento de crear la cobranza agarre el precio a pagar de la factura que esta relacionada y lo ponga ahi
        //Tambien hay que hacer que se ponga la fecha automaticamente del momento en la que se creo.
        //Y al momento de crearse una cobranza y poner la ID del medio de pago, que agarre la descripcion de este y lo meta en la cobranza asi se sabe con que pago.
        public async Task<APIResponse> Crear([FromBody] CobranzaCreateDto cobranzaCreateDto)
        {
            try
            {
                var cobranza = _mapper.Map<Cobranza>(cobranzaCreateDto);
                var factura = await _unitOfWork.repositoryFactura.ObtenerPorId(cobranza.NumeroFactura);
                var metodoDePago = await _unitOfWork.repositoryMedioDePago.ObtenerPorId(cobranza.MedioDePago);
                if (factura == null)
                {
                    _logger.LogError("No existe factura con ese número.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                if (metodoDePago == null)
                {
                    _logger.LogError("No existe metodo de pago asociado con el id ingresado..");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                cobranza.Descripcion = metodoDePago.Descripcion; //coloco la descirpcion del metodo de pago en la de la cobranza
                factura.EstadoPago = true;
                cobranza.Importe = factura.PrecioTotal;
                cobranza.FechaDeCobro = DateOnly.FromDateTime(DateTime.Now);
                await _unitOfWork.repositoryFactura.Actualizar(factura); //actualizo estado de pago
                await _unitOfWork.repositoryCobranza.Crear(cobranza);
                await _unitOfWork.Save();
                _logger.LogInformation("Cobranza creada con exito.");
                return Utilidades.CreatedResponse(_apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Actualizar([FromBody] CobranzaUpdateDto cobranzaUpdateDto)
        {
            try
            {
                var cobranza = await _unitOfWork.repositoryCobranza.ObtenerPorId(cobranzaUpdateDto.IdCobranza);
                if (cobranza == null)
                {
                    _logger.LogError("No existe una cobranza con esa id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _mapper.Map(cobranzaUpdateDto, cobranza);
                cobranza.FechaDeCobro = DateOnly.FromDateTime(DateTime.Now);
                await _unitOfWork.repositoryCobranza.Actualizar(cobranza);
                await _unitOfWork.Save();
                _logger.LogInformation("Cobranza actualizada con exito.");
                return Utilidades.OKResponse(cobranza, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Eliminar(int id)
        {
            try
            {
                var cobranza = await _unitOfWork.repositoryCobranza.ObtenerPorId(id);
                if (cobranza == null)
                {
                    _logger.LogError("No existe un producto con esa id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                await _unitOfWork.repositoryCobranza.Eliminar(cobranza);
                await _unitOfWork.Save();
                _logger.LogInformation("Cobranza eliminada con exito.");
                return Utilidades.OKResponse(cobranza, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }
    }
}
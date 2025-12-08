import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Autocomplete,
  Box,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Grid,
  useTheme,
  Typography,
  IconButton,
  Button,
  Divider,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Person from "@mui/icons-material/PersonRounded";
import ShoppingCart from "@mui/icons-material/ShoppingCartOutlined";
import InvoiceIcon from "@mui/icons-material/AssignmentOutlined";
import Add from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import CheckIcon from "@mui/icons-material/CheckRounded";
import EyeIcon from "@mui/icons-material/RemoveRedEyeRounded";
import PrintIcon from "@mui/icons-material/LocalPrintshopRounded";
import PaymentIcon from "@mui/icons-material/PointOfSaleRounded";
import RemoveIcon from "@mui/icons-material/ClearRounded";
import ArrowBackIosRounded from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/es";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CardPaymentMethod from "../components/CardPaymentMethod";
import CardIcon1 from "@mui/icons-material/CreditCardRounded";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import AllIcon from "@mui/icons-material/AllInclusive";

export default function InvoicesPage({ showAlert }) {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const theme = useTheme();

  // peticion de clientes
  const request_get = async () => {
    try {
      const [clientsResponse, productsResponse] = await Promise.all([
        axios.get("http://localhost:5224/api/Cliente/Listar"),
        axios.get("http://localhost:5224/api/Producto/Listar"),
      ]);
      setClients(clientsResponse.data.resultado);
      setProducts(productsResponse.data.resultado);
    } catch (error) {
      console.error("error al traer datos:", error);
    }
  };

  useEffect(() => {
    request_get();
  }, []);

  // cliente seleccionado
  const [selectedClient, setSelectedClient] = useState(null);
  const handleClientChange = (event, newValue) => {
    if (newValue) {
      const clientId = newValue.idCliente;
      setSelectedClient(newValue);
    } else {
      setSelectedClient(null);
    }
  };

  // producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleProductChange = (event, newValue) => {
    if (newValue) {
      const productId = newValue.idProducto;
      setSelectedProduct(newValue);
    } else {
      setSelectedProduct(null);
      setQuantity(0);
    }
  };

  // cantidad
  const [quantity, setQuantity] = useState(0);
  const handleQuantityChange = (event) => {
    const value = Math.max(0, event.target.value);
    if (selectedProduct && value > selectedProduct.stockActual) {
      showAlert(`Stock máximo: ${selectedProduct.stockActual}`, "error");
      setQuantity(selectedProduct.stockActual);
    } else {
      setQuantity(value);
    }
  };

  // carrito de compras
  const [cart, setCart] = useState([]);
  const handleAddToCart = () => {
    if (selectedProduct && quantity > 0) {
      const existingItemIndex = cart.findIndex(
        (item) => item.idProducto === selectedProduct.idProducto
      );
      const existingCartItem = cart[existingItemIndex];
      const totalQuantityInCart = existingCartItem
        ? existingCartItem.cantidad
        : 0;
      const newTotalQuantity = totalQuantityInCart + quantity;

      if (newTotalQuantity > selectedProduct.stockActual) {
        showAlert(`Stock máximo: ${selectedProduct.stockActual}`, "error");
      } else {
        if (existingItemIndex !== -1) {
          // si ya esta, actualiza la cantidad
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].cantidad = newTotalQuantity;
          updatedCart[existingItemIndex].total +=
            quantity * selectedProduct.precioVenta;

          setCart(updatedCart);
        } else {
          // si no esta, agregarlo
          const newItem = {
            ...selectedProduct,
            cantidad: quantity,
            total: quantity * selectedProduct.precioVenta,
          };
          setCart([...cart, newItem]);
        }

        setTotalPrice(totalPrice + quantity * selectedProduct.precioVenta);
        setSelectedProduct(null);
        setQuantity(0);
      }
    }
  };

  // eliminar producto del carrito
  const handleRemoveFromCart = (productId) => {
    const productToRemove = cart.find((item) => item.idProducto === productId);
    if (productToRemove) {
      setTotalPrice(totalPrice - productToRemove.total);
    }
    setCart(cart.filter((item) => item.idProducto !== productId));
  };

  // precio total
  const [totalPrice, setTotalPrice] = useState(0);

  // abrir/cerrar dialog
  const [dialogFinishInvoice, setDialogFinishInvoice] = useState(false);
  const toggledialogFinishInvoice = () => {
    setDialogFinishInvoice(!dialogFinishInvoice);
  };

  // almacenar la id de la factura nueva
  const [newInvoiceId, setNewInvoiceId] = useState(null);

  // peticion post (factura)
  const request_post = async () => {
    try {
      if (!selectedClient) {
        showAlert("Debes seleccionar un cliente", "error");
        return;
      }
      if (cart.length === 0) {
        showAlert("El carrito está vacío", "error");
        return;
      }

      const facturaData = {
        idCliente: selectedClient.idCliente,
        lista_De_Productos: cart.map((product) => ({
          cantidadDelProducto: product.cantidad,
          idProducto: product.idProducto,
        })),
      };

      const response = await axios.post(
        "http://localhost:5224/api/Factura/Registrar",
        facturaData
      );

      console.log("factura creada: ", response.data);
      setNewInvoiceId(response.data.resultado.idFactura);

      await request_get();
      setCart([]);
      setSelectedClient(null);
      setSelectedProduct(null);
      setTotalPrice(0);
      request_getInvoices();

      toggledialogFinishInvoice();
      showAlert("Factura creada", "success");
    } catch (error) {
      console.log("error al crear factura: ", error);
      showAlert("Error", "error");
    }
  };

  // tabs
  const [tabValue, setTabValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // cosas de la otra pag
  const [invoices, setInvoices] = useState([]);

  // peticion de facturas
  const request_getInvoices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5224/api/Factura/Listar"
      );
      setInvoices(response.data.resultado);
    } catch (error) {
      console.error("error al traer facturas:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await request_getInvoices();
    };
    fetchData();
  }, []);

  // factura seleccionado
  const [invoiceSelected, setInvoiceSelected] = useState(null);

  // seleccionar factura
  const selectInvoice = async (invoice, action) => {
    setInvoiceSelected(invoice);
    await fetchProductDetails(invoice.lista_De_Productos);
    action === "view" ? (
      toggledialogView()
    ) : action === "print" ? (
      <>
        {toggledialogPrint()} {printInvoice(invoice)}
      </>
    ) : (
      toggledialogPayment()
    );
  };

  // obtener datos del producto
  const [productDetails, setProductDetails] = useState({});
  const fetchProductDetails = async (products) => {
    const productDetails = {};
    for (const product of products) {
      try {
        const response = await axios.get(
          `http://localhost:5224/api/Producto/Consultar/${product.idProducto}`
        );
        productDetails[product.idProducto] = response.data.resultado;
      } catch (error) {
        console.error("error al traer producto:", error);
      }
    }
    setProductDetails(productDetails);
  };

  // imprimir factura
  const printInvoice = async (invoice) => {
    try {
      const response = await axios.get(
        `http://localhost:5224/api/Factura/Imprimir/${invoice.idFactura}`
      );
      console.log("factura impresa:", invoice.idFactura);
    } catch (error) {
      console.error("error al imprimir factura:", error);
    }
  };

  // abrir/cerrar dialog de consulta de factura
  const [dialogView, setDialogView] = useState(false);
  const toggledialogView = () => {
    setDialogView(!dialogView);
  };

  // abrir/cerrar dialog de imprimir factura
  const [dialogPrint, setDialogPrint] = useState(false);
  const toggledialogPrint = () => {
    setDialogPrint(!dialogPrint);
  };

  // abrir/cerrar para realizar pago
  const [dialogPayment, setDialogPayment] = useState(false);
  const toggledialogPayment = () => {
    setDialogPayment(!dialogPayment);
  };

  // abrir/cerrar al terminar cobranza
  const [dialogFinishPayment, setDialogFinishPayment] = useState(false);
  const toggledialogFinishPayment = () => {
    setDialogFinishPayment(!dialogFinishPayment);
  };

  // elejir como buscar
  const [searchOption, setSearchOption] = React.useState(1);
  const handleSearchOption = (event) => {
    setSearchOption(event.target.value);
  };

  // filtrado por pagadas/sin pagar/todas
  const [payState, setPayState] = useState("Ver Todos");
  const handleChangePayState = () => {
    setPage(1);
    if (payState === "Ver Todos") {
      setPayState("Solo Pendientes");
    } else if (payState === "Solo Pendientes") {
      setPayState("Solo Completados");
    } else {
      setPayState("Ver Todos");
    }
  };
  const getPayStateIcon = () => {
    if (payState === "Ver Todos") {
      return <AllIcon fontSize="large" />;
    } else if (payState === "Solo Pendientes") {
      return <RemoveIcon fontSize="large" color={"error"} />;
    } else {
      return <CheckIcon fontSize="large" color={"success"} />;
    }
  };

  // filtrado de facturas
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredInvoices = invoices.filter((invoice) => {
    // filtrar por estado de pago
    if (payState === "Solo Pendientes" && invoice.estadoPago) {
      return false;
    }
    if (payState === "Solo Completados" && !invoice.estadoPago) {
      return false;
    }

    // filtrar por búsqueda
    if (searchOption === 1) {
      // id
      return invoice.idFactura.toString().startsWith(searchQuery);
    } else if (searchOption === 2) {
      // fecha
      const invoiceDate = new Date(invoice.fechaFactura);
      const isAfterStartDate = startDate
        ? invoiceDate >= new Date(startDate)
        : true;
      const isBeforeEndDate = endDate ? invoiceDate <= new Date(endDate) : true;
      return isAfterStartDate && isBeforeEndDate;
    } else if (searchOption === 3) {
      // cliente
      const searchString = searchQuery.toLowerCase();
      return (
        invoice.fCliente.nombre.toLowerCase().startsWith(searchString) ||
        invoice.fCliente.apellido.toLowerCase().startsWith(searchString) ||
        invoice.idCliente.toString().startsWith(searchQuery)
      );
    }
    return true;
  });

  // paginado
  const [page, setPage] = useState(1);
  const invoicesPerPage = 8; // facturas por pagina

  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const indexOfLastInvoice = page * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  // delay para imprimir
  const [showFirstBox, setShowFirstBox] = useState(true);
  useEffect(() => {
    setShowFirstBox(true);
    const timer = setTimeout(() => {
      setShowFirstBox(false);
    }, 2000); // 2 segundos de delay
    return () => clearTimeout(timer);
  }, [invoiceSelected]);

  // tabs del pago
  const [value, setValue] = React.useState("1");
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  // COSAS DEL POST DE COBRANZAS

  // metodo de pago seleccionado
  const [methodSelected, setMethodSelected] = useState({
    numeroDeTarjeta: 0,
    fechaDeCaducidad: null,
    codigoDeSeguridad: 0,
    nombre: "",
    apellido: "",
    localidad: "",
    direccionDeFacturacion: "",
    pais: "",
    telefono: 0,
  });

  // limpiar campos
  const clearFields = () => {
    setMethodSelected({
      numeroDeTarjeta: 0,
      fechaDeCaducidad: null,
      codigoDeSeguridad: 0,
      nombre: "",
      apellido: "",
      localidad: "",
      direccionDeFacturacion: "",
      pais: "",
      telefono: 0,
    });
    setExpirationDate(null);
    setInvoiceSelected(null);
  };

  const [expirationDate, setExpirationDate] = useState(null);

  // credito/debito
  const [cardType, setCardType] = useState("credito");

  // almacenar id de la cobranza para el finishDialog
  const [paymentId, setPaymentId] = useState(null);

  // almacenar id del metodo de pago
  const [paymentMethodId, setPaymentMethodId] = useState(null);

  // aparecer qr
  const [loading, setLoading] = useState(false);
  const [qrString, setQrString] = useState("");

  const handleGenerateQR = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  // request post del metodo de pago credito/debito
  const request_postCard = async () => {
    try {
      if (!invoiceSelected) {
        showAlert(
          "Por favor selecciona una factura",
          "error",
          <AssignmentOutlined />
        );
        return;
      }
      if (!methodSelected.numeroDeTarjeta || !expirationDate) {
        showAlert(
          "Por favor completa los detalles del método de pago",
          "error",
          <CardIcon1 />
        );
        return;
      }

      // determinamos si es de credito/debito
      const url =
        cardType === "credito"
          ? "http://localhost:5224/api/MedioDeCobro/RegistrarCobroConTarjetaDeCredito"
          : cardType === "debito"
          ? "http://localhost:5224/api/MedioDeCobro/RegistrarCobroConTarjetaDeDebito"
          : "";

      // crear metodo de pago
      const paymentMethodResponse = await axios.post(url, methodSelected);

      // almacenar id del metodo de pago
      const newPaymentMethodId =
        paymentMethodResponse.data.resultado.idMedioDePago;
      console.log(`metodo ${cardType} creado: `, paymentMethodResponse.data);

      await request_postPayment(newPaymentMethodId);
    } catch (error) {
      console.log(`error al crear metodo ${cardType}: `, error);
    }
  };

  // request post del metodo de pago qr
  const request_postQR = async () => {
    try {
      // 1. crear el metodo de pago
      const QrResponse = await axios.get(
        `http://localhost:5224/api/MedioDeCobro/RegistrarCobroConCodigoQR?id=${invoiceSelected.idCliente.toString()}`
      );

      // 2. almacenar id del metodo de pago
      const newPaymentMethodId = QrResponse.data.resultado.idMedioDePago;
      setPaymentMethodId(newPaymentMethodId);

      // 3. almacenar el string del qr generado
      setQrString(QrResponse.data.qr);

      handleGenerateQR();

      console.log("metodo qr creado: ", QrResponse.data);
    } catch (error) {
      console.log("error al crear qr: ", error);
    }
  };

  // request post de la cobranza
  const request_postPayment = async (paymentMethodId) => {
    try {
      // data almacena la id factura y id metodo de pago
      const data = {
        numeroFactura: invoiceSelected.idFactura,
        medioDePago: paymentMethodId,
      };

      console.log("data: ", data);

      // crear cobranza
      const dataResponse = await axios.post(
        "http://localhost:5224/api/Cobranza/Registrar/",
        data
      );

      // almacenar id de la cobranza para mostrarla en el dialog finish
      setPaymentId(dataResponse.data.resultado.idCobranza);

      console.log("cobranza creada:", dataResponse.data);
      showAlert("Cobranza realizada", "success");
      toggledialogFinishPayment();
      request_getInvoices();
      clearFields();
      setQrString("");
    } catch (error) {
      console.error("error al crear cobranza:", error);
      showAlert("Error", "error");
    }
  };

  useEffect(() => {
    clearFields();
  }, []);

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label="Ver Facturas" value="1" />
            <Tab label="Crear Factura" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems={"center"}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Buscar por</InputLabel>
                <Select
                  label="Buscar por"
                  value={searchOption}
                  onChange={handleSearchOption}
                >
                  <MenuItem value={1}>ID</MenuItem>
                  <MenuItem value={2}>Fecha</MenuItem>
                  <MenuItem value={3}>Cliente</MenuItem>
                </Select>
              </FormControl>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {searchOption === 1 ? (
                <TextField
                  label="ID"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 300 }}
                />
              ) : searchOption === 2 ? (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Fecha Inicio"
                      value={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                      }}
                      slotProps={{
                        textField: { variant: "outlined" },
                      }}
                      sx={{ width: "100%" }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                  <Typography variant={"h5"} marginX={1} color={"grey"}>
                    -
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Fecha Fin"
                      value={endDate}
                      onChange={(date) => {
                        setEndDate(date);
                      }}
                      slotProps={{
                        textField: { variant: "outlined" },
                      }}
                      sx={{ width: "100%" }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </>
              ) : (
                <TextField
                  label="Cliente"
                  variant="outlined"
                  sx={{ minWidth: 300 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}
              &nbsp;&nbsp;&nbsp;
              <Tooltip title={payState} arrow>
                <IconButton fontSize="large" onClick={handleChangePayState}>
                  {getPayStateIcon()}
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ marginLeft: "auto", display: "flex" }}>
              <IconButton
                size="large"
                onClick={handlePrevPage}
                disabled={page === 1}
                sx={{ height: "90%" }}
              >
                <ArrowBackIosRounded />
              </IconButton>
              <IconButton
                size="large"
                onClick={handleNextPage}
                disabled={indexOfLastInvoice >= filteredInvoices.length}
                sx={{ height: "90%" }}
              >
                <ArrowForwardIosRounded />
              </IconButton>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell>Cliente </TableCell>
                  <TableCell align="center">Fecha</TableCell>
                  <TableCell align="center">Total</TableCell>

                  <TableCell align="center">Estado de Pago</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentInvoices.map((invoice) => (
                  <TableRow key={invoice.idFactura}>
                    <TableCell align="center">{invoice.idFactura}</TableCell>
                    <TableCell>{`(${invoice.idCliente}) ${invoice.fCliente.nombre} ${invoice.fCliente.apellido}`}</TableCell>
                    <TableCell align="center">{invoice.fechaFactura}</TableCell>
                    <TableCell align="center">{`$${invoice.precioTotal}`}</TableCell>
                    <TableCell align="center">
                      {invoice.estadoPago ? (
                        <Tooltip title="Completado" arrow>
                          <CheckIcon color={"success"} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Pendiente" arrow>
                          <RemoveIcon color={"error"} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver Factura" arrow>
                        <IconButton
                          size="small"
                          onClick={() => selectInvoice(invoice, "view")}
                        >
                          <EyeIcon />
                        </IconButton>
                      </Tooltip>
                      &nbsp;&nbsp;&nbsp;
                      <Tooltip title="Imprimir" arrow>
                        <IconButton
                          size="small"
                          onClick={() => selectInvoice(invoice, "print")}
                        >
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>
                      {invoice.estadoPago === false && (
                        <>
                          &nbsp;&nbsp;&nbsp;
                          <Tooltip title="Cobrar" arrow>
                            <IconButton
                              size="small"
                              onClick={() => selectInvoice(invoice, "pay")}
                            >
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value="2">
          <Grid container spacing={3}>
            <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
              {/* card de clientes */}
              <Card
                sx={{
                  width: "100%",
                  border:
                    theme.palette.mode === "light" ? "1px solid #ccc" : "none",
                  marginBottom: 3,
                  borderRadius: 2,
                }}
              >
                <CardHeader
                  title={
                    <Box display={"flex"} alignItems={"center"}>
                      <Person
                        fontSize={"large"}
                        sx={{ color: "#fff", marginRight: 1.5 }}
                      />
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#fff",
                        }}
                      >
                        Elegir Cliente
                      </Typography>
                    </Box>
                  }
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.secondary.dark
                        : null,
                  }}
                />
                <CardContent>
                  <Box display={"flex"} alignItems={"center"}>
                    <Autocomplete
                      disablePortal
                      options={clients}
                      sx={{ width: "100%" }}
                      getOptionLabel={(option) =>
                        `(${option.idCliente}) ${option.nombre} ${option.apellido}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Cliente" />
                      )}
                      onChange={handleClientChange}
                      value={selectedClient}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* card de productos */}
              <Card
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  border:
                    theme.palette.mode === "light" ? "1px solid #ccc" : "none",
                }}
              >
                <CardHeader
                  title={
                    <Box display={"flex"} alignItems={"center"}>
                      <ShoppingCart
                        fontSize={"large"}
                        sx={{ color: "#fff", marginRight: 1.5 }}
                      />
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#fff",
                        }}
                      >
                        Elegir Productos
                      </Typography>
                    </Box>
                  }
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.secondary.dark
                        : null,
                  }}
                />
                <CardContent>
                  <Box display={"flex"} alignItems={"center"}>
                    <Autocomplete
                      disablePortal
                      options={products.filter(
                        (product) => product.stockActual !== 0
                      )}
                      sx={{ width: "100%" }}
                      getOptionLabel={(option) => {
                        return `(${option.idProducto}) ${option.descripcion}`;
                      }}
                      renderOption={({ key, ...props }, option) => (
                        <Box component="li" key={option.idProducto} {...props}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div>{`(${option.idProducto}) ${option.descripcion}`}</div>
                            <div>{`$${option.precioVenta}`}</div>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Producto" />
                      )}
                      onChange={handleProductChange}
                      value={selectedProduct}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <TextField
                      type="number"
                      label="Cantidad"
                      InputProps={{
                        inputProps: {
                          min: 0,
                        },
                      }}
                      sx={{ width: "50%" }}
                      onChange={handleQuantityChange}
                      disabled={!selectedProduct}
                      value={quantity}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Tooltip title="Agregar al Carrito" arrow>
                      <Button
                        variant={"contained"}
                        style={{ alignSelf: "stretch" }}
                        onClick={handleAddToCart}
                        color={"secondary"}
                      >
                        <Add fontSize={"large"} />
                      </Button>
                    </Tooltip>
                  </Box>
                  <Divider sx={{ marginY: 3 }} />
                  <Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell align="center">Cantidad</TableCell>
                            <TableCell align="center">Precio</TableCell>
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">Eliminar</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cart.map((product) => (
                            <TableRow key={product.idProducto}>
                              <TableCell align="center">
                                {product.idProducto}
                              </TableCell>
                              <TableCell>{product.descripcion}</TableCell>
                              <TableCell align="center">
                                {product.cantidad}
                              </TableCell>
                              <TableCell align="center">
                                {`$${product.precioVenta}`}
                              </TableCell>
                              <TableCell align="center">{`$${product.total}`}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleRemoveFromCart(product.idProducto)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              {/* card de factura */}
              <Card
                sx={{
                  width: "100%",
                  border:
                    theme.palette.mode === "light" ? "1px solid #ccc" : "none",
                  marginBottom: 3,
                  borderRadius: 2,
                }}
              >
                <CardHeader
                  title={
                    <Box display={"flex"} alignItems={"center"}>
                      <InvoiceIcon
                        fontSize={"large"}
                        sx={{ color: "#fff", marginRight: 1.5 }}
                      />
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#fff",
                        }}
                      >
                        Factura
                      </Typography>
                    </Box>
                  }
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.secondary.dark
                        : null,
                  }}
                />
                <CardContent>
                  <Box display={"flex"} alignItems={"center"}>
                    <TextField
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      label={"Total"}
                      sx={{ width: "100%" }}
                      value={totalPrice}
                    />
                  </Box>
                </CardContent>
              </Card>
              <Button
                variant={"contained"}
                color={"success"}
                style={{ height: 45, width: "100%" }}
                onClick={request_post}
              >
                Terminar Factura
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>

      {/* dialog de terminar factura */}
      <Dialog
        open={dialogFinishInvoice}
        onClose={toggledialogFinishInvoice}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogContent sx={{ paddingBottom: 1 }}>
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Typography variant={"h4"}> Factura Completada!</Typography>
            &nbsp;
            <CheckIcon color={"success"} sx={{ fontSize: 85 }} />
            &nbsp;
            <Typography variant={"h5"}>
              Numero de Orden: {newInvoiceId}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", marginY: 1 }}>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={toggledialogFinishInvoice}
            sx={{ width: "70%" }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de consultar factura */}
      <Dialog
        open={dialogView}
        onClose={toggledialogView}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ paddingBottom: 0 }}>
          {invoiceSelected && `Detalle Venta ${invoiceSelected.idFactura}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
            <Grid item xs={6} sx={{ marginBottom: 1.5 }}>
              <TextField
                label="Fecha"
                name="fechaFactura"
                fullWidth
                autoComplete="off"
                InputProps={{
                  readOnly: true,
                }}
                value={invoiceSelected ? invoiceSelected.fechaFactura : ""}
                sx={{ marginBottom: 1.5 }}
              />

              <TextField
                label="Total"
                name="precioTotal"
                fullWidth
                autoComplete="off"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                value={invoiceSelected ? invoiceSelected.precioTotal : ""}
                sx={{ marginBottom: 1.5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cliente"
                name="cliente"
                fullWidth
                autoComplete="off"
                InputProps={{
                  readOnly: true,
                }}
                value={
                  invoiceSelected
                    ? `(${invoiceSelected.idCliente}) ${invoiceSelected.fCliente.nombre} ${invoiceSelected.fCliente.apellido}`
                    : ""
                }
                sx={{ marginBottom: 1.5 }}
              />
              <TextField
                label="Estado de Pago"
                name="estadoPago"
                fullWidth
                autoComplete="off"
                InputProps={{
                  readOnly: true,
                }}
                value={
                  invoiceSelected
                    ? invoiceSelected.estadoPago
                      ? "Completado"
                      : "Pendiente"
                    : ""
                }
              />
            </Grid>
          </Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Precio Unidad</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceSelected &&
                  invoiceSelected.lista_De_Productos.map((product) => (
                    <TableRow key={product.idProducto}>
                      <TableCell align="center">{product.idProducto}</TableCell>
                      <TableCell>
                        {productDetails[product.idProducto]?.descripcion}
                      </TableCell>
                      <TableCell align="center">
                        {product.cantidadDelProducto}
                      </TableCell>
                      <TableCell align="center">
                        {`$${productDetails[product.idProducto]?.precioVenta}`}
                      </TableCell>
                      <TableCell align="center">
                        {`$${
                          productDetails[product.idProducto]?.precioVenta *
                          product.cantidadDelProducto
                        }`}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ marginRight: 2, marginBottom: 1 }}>
          <Button
            onClick={() => selectInvoice(invoiceSelected, "print")}
            variant={"contained"}
            color={"info"}
            sx={{ marginRight: 0.5 }}
          >
            Imprimir
          </Button>
          {invoiceSelected && invoiceSelected.estadoPago === false && (
            <Button
              onClick={toggledialogPayment}
              variant={"contained"}
              color={"success"}
              sx={{ marginRight: 0.5 }}
            >
              Pagar
            </Button>
          )}

          <Button
            onClick={toggledialogView}
            variant={"contained"}
            color={"secondary"}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de imprimir factura */}
      <Dialog
        open={dialogPrint}
        onClose={toggledialogPrint}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogContent sx={{ paddingBottom: 1 }}>
          {showFirstBox ? (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography variant={"h4"}>
                {invoiceSelected &&
                  `Imprimiendo Factura ${invoiceSelected.idFactura}`}
              </Typography>
              &nbsp;
              <CircularProgress
                color="success"
                style={{ width: 85, height: 85 }}
              />
              &nbsp;
              <Typography variant={"h5"}>Cargando...</Typography>
            </Box>
          ) : (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography variant={"h4"}>
                {invoiceSelected &&
                  `Factura ${invoiceSelected.idFactura} Impresa`}
              </Typography>
              &nbsp;
              <CheckIcon color={"success"} sx={{ fontSize: 85 }} />
              &nbsp;
              <Typography variant={"h5"}>Revisa tus descargas!</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", marginY: 1 }}>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={toggledialogPrint}
            sx={{ width: "70%" }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de pagar factura */}
      <Dialog
        open={dialogPayment}
        onClose={() => {
          toggledialogPayment();
          clearFields();
        }}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogContent sx={{ paddingBottom: 1 }}>
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Typography variant={"h4"}>
              {invoiceSelected && "Metodo de Pago"}
            </Typography>
            &nbsp;
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleChangeTab}>
                  <Tab label="Credito" value="1" />
                  <Tab label="Debito" value="2" />
                  <Tab label="QR" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ padding: 0 }}>
                <CardPaymentMethod
                  {...{
                    methodSelected,
                    setMethodSelected,
                    expirationDate,
                    setExpirationDate,
                    selectedInvoice: invoiceSelected,
                  }}
                />
              </TabPanel>
              <TabPanel value="2" sx={{ padding: 0 }}>
                <CardPaymentMethod
                  {...{
                    methodSelected,
                    setMethodSelected,
                    expirationDate,
                    setExpirationDate,
                    selectedInvoice: invoiceSelected,
                  }}
                />
              </TabPanel>
              <TabPanel value="3" style={{ padding: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {qrString !== "" ? (
                    <>
                      <img
                        src={`data:image/png;base64,${qrString}`}
                        alt="qr"
                        style={{
                          width: "50%",
                          height: "auto",
                          borderRadius: "10px",
                          margin: 25,
                        }}
                      />
                      <Typography variant={"h6"}>Escanea el QR</Typography>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      style={{ height: 45, margin: 50 }}
                      onClick={request_postQR}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress color="inherit" size={24} />
                      ) : (
                        "Generar QR"
                      )}
                    </Button>
                  )}
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
        <DialogActions sx={{ marginY: 1, marginRight: 2 }}>
          <Button
            variant={"contained"}
            color={"error"}
            onClick={toggledialogPayment}
          >
            Cancelar
          </Button>
          &nbsp;
          <Button
            variant={"contained"}
            color={"success"}
            onClick={
              value === "3"
                ? () => request_postPayment(paymentMethodId)
                : () => request_postCard()
            }
          >
            Pagar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de terminar cobranza */}
      <Dialog
        open={dialogFinishPayment}
        onClose={toggledialogFinishPayment}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogContent sx={{ paddingBottom: 1 }}>
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Typography variant={"h4"}> Cobranza Completada!</Typography>
            &nbsp;
            <CheckIcon color={"success"} sx={{ fontSize: 85 }} />
            &nbsp;
            <Typography variant={"h5"}>
              Numero de Cobranza: {paymentId}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", marginY: 1 }}>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={() => {
              toggledialogFinishPayment();
              toggledialogPayment();
            }}
            sx={{ width: "70%" }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

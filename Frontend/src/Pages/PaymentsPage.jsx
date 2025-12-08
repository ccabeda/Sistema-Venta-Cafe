import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Grid,
  Typography,
  CardHeader,
  CardContent,
  Card,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  CardActions,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ArrowBackIosRounded from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@emotion/react";
import InvoiceIcon from "@mui/icons-material/AssignmentOutlined";
import CardIcon1 from "@mui/icons-material/CreditCardRounded";
import CardIcon2 from "@mui/icons-material/CreditCardTwoTone";
import QrIcon from "@mui/icons-material/QrCodeRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/PersonRounded";
import DateIcon from "@mui/icons-material/CalendarMonthRounded";
import PriceIcon from "@mui/icons-material/PaidRounded";
import CafeIcon1 from "@mui/icons-material/LocalCafe";
import CafeIcon2 from "@mui/icons-material/LocalCafeOutlined";
import CafeIcon3 from "@mui/icons-material/LocalCafeTwoTone";
import CardPaymentMethod from "../components/CardPaymentMethod";
import CheckIcon from "@mui/icons-material/CheckRounded";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import qr from "../assets/qr.jpg";

export default function PaymentsPage({ showAlert }) {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]);
  const theme = useTheme();

  // peticion de facturas, cobranzas y productos
  const request_getData = async () => {
    try {
      const [invoicesResponse, paymentsResponse, productsResponse] =
        await Promise.all([
          axios.get("http://localhost:5224/api/Factura/Listar"),
          axios.get("http://localhost:5224/api/Cobranza/Listar"),
          axios.get("http://localhost:5224/api/Producto/Listar"),
        ]);
      setInvoices(invoicesResponse.data.resultado);
      setPayments(paymentsResponse.data.resultado);
      setProducts(productsResponse.data.resultado);
      await fetchInvoiceDetails(paymentsResponse.data.resultado);
    } catch (error) {
      console.error("error al traer datos:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await request_getData();
    };
    fetchData();
  }, []);

  // peticion delete
  const request_deletePayment = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5224/api/Cobranza/Anular/` +
          paymentSelected.idCobranza,
        paymentSelected
      );
      console.log("cobranza eliminada correctamente");
      request_getData();
      toggledialogDelete();
      showAlert("Cobranza eliminada", "error", <DeleteIcon />);
    } catch (error) {
      console.error("error al eliminar cobranza: ", error);
      showAlert("Error", "error");
    }
  };

  // cobranza seleccionada
  const [paymentSelected, setPaymentSelected] = useState({
    idFactura: 0,
    idMetodoDePago: 0,
  });

  // seleccionar cobranza
  const selectPayment = (payment, action) => {
    setPaymentSelected(payment);
    action === "delete" && toggledialogDelete();
  };

  // obtener detalles de las facturas
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const fetchInvoiceDetails = async (payments) => {
    const details = {};
    const fetchDetail = async (idFactura) => {
      if (!details[idFactura]) {
        try {
          const response = await axios.get(
            `http://localhost:5224/api/Factura/Consultar/${idFactura}`
          );
          details[idFactura] = response.data.resultado;
        } catch (error) {
          console.error("error al traer factura:", error);
        }
      }
    };

    await Promise.all(
      payments.map((payment) => fetchDetail(payment.numeroFactura))
    );
    setInvoiceDetails(details);
  };

  // abrir/cerrar dialogs
  const [dialogAdd, setDialogAdd] = useState(false);
  const toggledialogAdd = () => {
    setDialogAdd(!dialogAdd);
  };

  const [dialogDelete, setDialogDelete] = useState(false);
  const toggledialogDelete = () => {
    setDialogDelete(!dialogDelete);
  };

  const [dialogFinish, setDialogFinish] = useState(false);
  const toggledialogFinish = () => {
    setDialogFinish(!dialogFinish);
  };

  // filtrado de  cobranzas
  const [searchQueryPayments, setsearchQueryPayments] = useState("");
  const filteredPayments = payments.filter((payment) =>
    payment.idCobranza.toString().startsWith(searchQueryPayments)
  );

  // paginado
  const [page, setPage] = useState(1);
  const paymentsPerPage = 8; // cobranzas por pagina

  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const indexOfLastPayment = page * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // tabs
  const [tabValue, setTabValue] = React.useState("1");
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // elejir como buscar
  const [searchOption, setSearchOption] = React.useState(1);
  const handleSearchOption = (event) => {
    setSearchOption(event.target.value);
  };

  // filtrado de facturas por fecha
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.fechaFactura);
    const isAfterStartDate = startDate
      ? invoiceDate >= new Date(startDate)
      : true;
    const isBeforeEndDate = endDate ? invoiceDate <= new Date(endDate) : true;
    return isAfterStartDate && isBeforeEndDate;
  });

  // factura seleccionada
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const handleInvoiceChange = (event, newValue) => {
    if (newValue) {
      const invoiceId = newValue.idFactura;
      console.log("factura seleccionada:", invoiceId);
      setSelectedInvoice(newValue);
    } else {
      setSelectedInvoice(null);
    }
  };

  // tab de elegir factura
  const [searchOptionValue, setSearchOptionValue] = React.useState("1");
  const handleChangeOptionValue = (event, newValue) => {
    setSearchOptionValue(newValue);
    setSelectedInvoice(null);
  };

  // tabs del pago
  const [payMethodTab, setPayMethodTab] = React.useState("1");
  const handlePayMethodTab = (event, newValue) => {
    setPayMethodTab(newValue);
    newValue === "1"
      ? setCardType("credito")
      : newValue === "2"
      ? setCardType("debito")
      : setCardType("qr");
  };

  // iconos de la lista de productos de cada factura
  const avatarColor =
    theme.palette.mode === "light" ? theme.palette.secondary.main : "white";

  const getRandomIcon = () => {
    const icons = [<CafeIcon1 />, <CafeIcon2 />, <CafeIcon3 />];
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  // COSAS DEL POST

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
    setSelectedInvoice(null);
  };

  const [expirationDate, setExpirationDate] = useState(null);

  // manejar cambios en textfields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // si el campo es numerico, convertir a int/float
    const parsedValue =
      name === "numeroDeTarjeta" ||
      name === "codigoDeSeguridad" ||
      name === "telefono"
        ? parseFloat(value)
        : value;
    setMethodSelected((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));
  };

  // credito/debito
  const [cardType, setCardType] = useState("credito");

  // almacenar id de la cobranza para el finishDialog
  const [paymentId, setPaymentId] = useState(null);

  // almacenar id del metodo de pago
  const [paymentMethodId, setPaymentMethodId] = useState(null);

  // aparecer qr
  const [viewQR, setViewQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrString, setQrString] = useState("");

  const handleGenerateQR = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setViewQR(true);
    }, 1500);
  };

  // request post del metodo de pago credito/debito
  const request_postCard = async () => {
    try {
      if (!selectedInvoice) {
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
        `http://localhost:5224/api/MedioDeCobro/RegistrarCobroConCodigoQR?id=${selectedInvoice.idCliente.toString()}`
      );

      // 2. almacenar id del metodo de pago
      const newPaymentMethodId = QrResponse.data.resultado.idMedioDePago;
      setPaymentMethodId(newPaymentMethodId);

      // 3. almacenar el string del qr generado
      setQrString(QrResponse.data.qr);

      handleGenerateQR();

      console.log("metodo QR creado: ", QrResponse.data);
    } catch (error) {
      console.log("error al crear qr: ", error);
    }
  };

  // request post de la cobranza
  const request_postPayment = async (paymentMethodId) => {
    try {
      // data almacena la id factura y id metodo de pago
      const data = {
        numeroFactura: selectedInvoice.idFactura,
        medioDePago: paymentMethodId,
      };

      // crear cobranza
      const dataResponse = await axios.post(
        "http://localhost:5224/api/Cobranza/Registrar/",
        data
      );

      // almacenar id de la cobranza para mostrarla en el dialog finish
      setPaymentId(dataResponse.data.resultado.idCobranza);

      console.log("cobranza creada: ", dataResponse.data);
      showAlert("Cobranza realizada", "success");
      setSelectedInvoice(null);
      setViewQR(false);
      request_getData();
      toggledialogFinish();
      clearFields();
      setQrString("");
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("error al crear cobranza:", error);
      showAlert("Error", "error");
    }
  };

  useEffect(() => {
    clearFields();
  }, []);

  return (
    <>
      <Box>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChangeTab}>
              <Tab label="Ver Cobranzas" value="1" />
              <Tab label="Crear Cobranza" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems={"center"}>
                  <TextField
                    label="Buscar"
                    variant="outlined"
                    value={searchQueryPayments}
                    onChange={(e) => setsearchQueryPayments(e.target.value)}
                    sx={{ width: 400 }}
                    autoComplete="off"
                  />
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
                    disabled={indexOfLastPayment >= filteredPayments.length}
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
                      <TableCell align="center">Factura</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="center">Importe</TableCell>
                      <TableCell align="center">Fecha</TableCell>
                      <TableCell align="center">Metodo de Pago</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPayments.map((payment) => (
                      <TableRow key={payment.idCobranza}>
                        <TableCell align="center">
                          {payment.idCobranza}
                        </TableCell>
                        <TableCell align="center">
                          {payment.numeroFactura}
                        </TableCell>
                        <TableCell>
                          {invoiceDetails[payment.numeroFactura]?.idCliente !==
                            undefined &&
                          invoiceDetails[payment.numeroFactura]?.fCliente
                            ?.nombre !== undefined &&
                          invoiceDetails[payment.numeroFactura]?.fCliente
                            ?.apellido !== undefined ? (
                            <>
                              {"("}
                              {invoiceDetails[payment.numeroFactura].idCliente}
                              {") "}
                              {
                                invoiceDetails[payment.numeroFactura].fCliente
                                  .nombre
                              }{" "}
                              {
                                invoiceDetails[payment.numeroFactura].fCliente
                                  .apellido
                              }
                            </>
                          ) : (
                            "Cargando..."
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {invoiceDetails[payment.numeroFactura]
                            ?.precioTotal !== undefined
                            ? `$${
                                invoiceDetails[payment.numeroFactura]
                                  .precioTotal
                              }`
                            : "Cargando..."}
                        </TableCell>
                        <TableCell align="center">
                          {payment.fechaDeCobro}
                        </TableCell>
                        <TableCell align="center">
                          {payment.descripcion
                            .replace("Pago Realizado con ", "")
                            .replace(".", "")}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Eliminar" arrow>
                            <IconButton
                              size="small"
                              onClick={() => selectPayment(payment, "delete")}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <Grid container spacing={3}>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                {/* card de elegir factura */}
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    border:
                      theme.palette.mode === "light"
                        ? "1px solid #ccc"
                        : "none",
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
                          Elegir Factura
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
                  <CardContent sx={{ paddingTop: 0 }}>
                    <Box display="flex" flexDirection="column">
                      <TabContext value={searchOptionValue}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <TabList onChange={handleChangeOptionValue}>
                            <Tab label="ID Factura" value="1" />
                            <Tab label="Fecha" value="2" />
                            <Tab label="Cliente" value="3" />
                          </TabList>
                        </Box>
                        <TabPanel value="1">
                          <Autocomplete
                            disablePortal
                            sx={{ width: "100%" }}
                            options={invoices.filter(
                              (invoice) => !invoice.estadoPago
                            )}
                            getOptionLabel={(option) =>
                              `Factura ${option.idFactura}`
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="Buscar" />
                            )}
                            renderOption={({ key, ...props }, option) => (
                              <Box
                                component="li"
                                key={option.idFactura}
                                {...props}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={3}>
                                    <div>{`Factura ${option.idFactura}`}</div>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <div>{option.fechaFactura}</div>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <div>{`${option.fCliente.nombre} ${option.fCliente.apellido}`}</div>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={2}
                                    display="flex"
                                    justifyContent="right"
                                  >
                                    <div>{`$${option.precioTotal}`}</div>
                                  </Grid>
                                </Grid>
                              </Box>
                            )}
                            filterOptions={(options, state) =>
                              options.filter((option) =>
                                option.idFactura
                                  .toString()
                                  .startsWith(state.inputValue)
                              )
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.idFactura === value.idFactura
                            }
                            onChange={(event, newValue) => {
                              handleInvoiceChange(event, newValue);
                            }}
                            value={selectedInvoice}
                          />
                        </TabPanel>
                        <TabPanel value="2">
                          <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            marginBottom={3}
                          >
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
                            <Typography
                              variant={"h5"}
                              marginX={1}
                              color={"grey"}
                            >
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
                          </Box>
                          <FormControl fullWidth>
                            <InputLabel>Seleccionar</InputLabel>
                            <Select
                              value={
                                selectedInvoice ? selectedInvoice.idFactura : ""
                              }
                              label="Seleccionar"
                              onChange={(event) => {
                                const selectedId = event.target.value;
                                const selectedObject = filteredInvoices.find(
                                  (invoice) => invoice.idFactura === selectedId
                                );
                                handleInvoiceChange(event, selectedObject);
                              }}
                              MenuProps={{
                                PaperProps: { style: { maxHeight: 330 } },
                              }}
                            >
                              {filteredInvoices
                                .filter((invoice) => !invoice.estadoPago)
                                .map((invoice) => (
                                  <MenuItem
                                    key={invoice.idFactura}
                                    value={invoice.idFactura}
                                  >
                                    <Grid container spacing={2}>
                                      <Grid item xs={3}>
                                        <div>{`Factura ${invoice.idFactura}`}</div>
                                      </Grid>
                                      <Grid item xs={4}>
                                        <div>{invoice.fechaFactura}</div>
                                      </Grid>
                                      <Grid item xs={3}>
                                        <div>{`${invoice.fCliente.nombre} ${invoice.fCliente.apellido}`}</div>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={2}
                                        display="flex"
                                        justifyContent="right"
                                      >
                                        <div>{`$${invoice.precioTotal}`}</div>
                                      </Grid>
                                    </Grid>
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </TabPanel>
                        <TabPanel value="3">
                          <Autocomplete
                            disablePortal
                            sx={{ width: "100%" }}
                            options={invoices.filter(
                              (invoice) => !invoice.estadoPago
                            )}
                            getOptionLabel={(option) =>
                              `Factura ${option.idFactura}`
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="Buscar" />
                            )}
                            renderOption={({ key, ...props }, option) => (
                              <Box
                                component="li"
                                key={option.idFactura}
                                {...props}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <div>{`(${option.idCliente}) ${option.fCliente.nombre} ${option.fCliente.apellido}`}</div>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <div>{`Factura ${option.idFactura}`}</div>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <div>{option.fechaFactura}</div>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={2}
                                    display="flex"
                                    justifyContent="right"
                                  >
                                    <div>{`$${option.precioTotal}`}</div>
                                  </Grid>
                                </Grid>
                              </Box>
                            )}
                            filterOptions={(options, state) =>
                              options.filter(
                                (option) =>
                                  option.idCliente
                                    .toString()
                                    .startsWith(state.inputValue) ||
                                  option.fCliente.nombre.startsWith(
                                    state.inputValue
                                  ) ||
                                  option.fCliente.apellido.startsWith(
                                    state.inputValue
                                  )
                              )
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.idFactura === value.idFactura
                            }
                            value={selectedInvoice}
                            onChange={(event, newValue) =>
                              handleInvoiceChange(event, newValue)
                            }
                          />
                        </TabPanel>
                      </TabContext>
                      {selectedInvoice !== null && (
                        <Grid container marginLeft={3}>
                          <Grid item xs={6} sm={6} md={6}>
                            <List
                              sx={{
                                width: "100%",
                                maxWidth: 360,
                              }}
                            >
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ backgroundColor: avatarColor }}>
                                    <PersonIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary="Cliente"
                                  secondary={`${selectedInvoice.fCliente.nombre} ${selectedInvoice.fCliente.apellido}`}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ backgroundColor: avatarColor }}>
                                    <DateIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary="Fecha"
                                  secondary={selectedInvoice.fechaFactura}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ backgroundColor: avatarColor }}>
                                    <PriceIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary="Precio Total"
                                  secondary={`$ ${selectedInvoice.precioTotal}`}
                                />
                              </ListItem>
                            </List>
                          </Grid>
                          <Grid item xs={6} sm={3} md={6}>
                            <List sx={{ width: "100%", maxWidth: 360 }}>
                              {selectedInvoice.lista_De_Productos.map(
                                (producto, index) => (
                                  <ListItem key={index}>
                                    <ListItemAvatar>
                                      <Avatar>{getRandomIcon()}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        products.find(
                                          (prod) =>
                                            prod.idProducto ===
                                            producto.idProducto
                                        )?.descripcion ||
                                        `${producto.descripcion}`
                                      }
                                      secondary={
                                        producto.cantidadDelProducto === 1
                                          ? `${producto.cantidadDelProducto} unidad`
                                          : `${producto.cantidadDelProducto} unidades`
                                      }
                                    />
                                  </ListItem>
                                )
                              )}
                            </List>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                {/* card de metodo de pago */}
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    border:
                      theme.palette.mode === "light"
                        ? "1px solid #ccc"
                        : "none",
                    marginBottom: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardHeader
                    title={
                      <Box display={"flex"} alignItems={"center"}>
                        {payMethodTab === "1" ? (
                          <CardIcon1
                            fontSize={"large"}
                            sx={{ color: "#fff", marginRight: 1.5 }}
                          />
                        ) : payMethodTab === "2" ? (
                          <CardIcon2
                            fontSize={"large"}
                            sx={{ color: "#fff", marginRight: 1.5 }}
                          />
                        ) : (
                          <QrIcon
                            fontSize={"large"}
                            sx={{ color: "#fff", marginRight: 1.5 }}
                          />
                        )}

                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            color: "#fff",
                          }}
                        >
                          Metodo de pago
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
                  <CardContent sx={{ paddingTop: 0 }}>
                    <Box display="flex" flexDirection="column">
                      <TabContext value={payMethodTab}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <TabList onChange={handlePayMethodTab}>
                            <Tab label="Credito" value="1" />
                            <Tab label="Debito" value="2" />
                            <Tab label="QR" value="3" />
                          </TabList>
                        </Box>
                        <TabPanel value="1">
                          <CardPaymentMethod
                            {...{
                              methodSelected,
                              setMethodSelected,
                              expirationDate,
                              setExpirationDate,
                              selectedInvoice,
                            }}
                          />
                        </TabPanel>
                        <TabPanel value="2">
                          <CardPaymentMethod
                            {...{
                              methodSelected,
                              setMethodSelected,
                              expirationDate,
                              setExpirationDate,
                              selectedInvoice,
                            }}
                          />
                        </TabPanel>
                        <TabPanel
                          value="3"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          {viewQR ? (
                            <>
                              <img
                                src={`data:image/png;base64,${qrString}`}
                                alt="qr"
                                style={{
                                  width: "50%",
                                  height: "auto",
                                  borderRadius: "10px",
                                }}
                              />
                              <Typography marginTop={2} variant={"}}"}>
                                Escanea el QR
                              </Typography>
                            </>
                          ) : (
                            <Button
                              fullWidth
                              variant="contained"
                              color="secondary"
                              style={{ height: 45 }}
                              onClick={request_postQR}
                              disabled={(loading, !selectedInvoice)}
                            >
                              {loading ? (
                                <CircularProgress color="inherit" size={24} />
                              ) : (
                                "Generar QR"
                              )}
                            </Button>
                          )}
                        </TabPanel>
                      </TabContext>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ marginX: 3 }}>
                    <Button
                      fullWidth
                      variant={"contained"}
                      color={"success"}
                      style={{ height: 45, width: "100%" }}
                      onClick={
                        cardType === "qr"
                          ? () => request_postPayment(paymentMethodId)
                          : () => request_postCard()
                      }
                    >
                      terminar cobranza
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </Box>
      {/* AAAAAAAAAAAAAAAAAAAAAAAAAAAA */}

      {/* dialog de eliminar cobranza*/}
      <Dialog open={dialogDelete} onClose={toggledialogDelete}>
        <DialogTitle>Seguro que desea elimninar?</DialogTitle>
        <DialogActions sx={{ marginRight: 2, marginBottom: 1 }}>
          <Button
            onClick={toggledialogDelete}
            variant={"contained"}
            color={"error"}
          >
            No
          </Button>
          <Button
            variant={"contained"}
            color={"success"}
            onClick={request_deletePayment}
          >
            Si
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de terminar cobranza */}
      <Dialog
        open={dialogFinish}
        onClose={toggledialogFinish}
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
            onClick={toggledialogFinish}
            sx={{ width: "70%" }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

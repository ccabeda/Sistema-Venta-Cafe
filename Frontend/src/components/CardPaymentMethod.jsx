import React from "react";
import { Grid, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function CardPaymentMethod({
  methodSelected,
  setMethodSelected,
  expirationDate,
  setExpirationDate,
  selectedInvoice,
}) {
  // eleccion de fecha de vencimiento
  const handleExpirationDateChange = (date) => {
    setExpirationDate(date);
    try {
      const formattedDate = date ? date.toISOString().slice(0, 10) : null;
      setMethodSelected((prevState) => ({
        ...prevState,
        fechaDeCaducidad: formattedDate,
      }));
    } catch (error) {
      console.error("fecha invalida: ", error);
    }
  };

  // manejar cambios en textfields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // si el campo es numerico, convertir a int/float solo si el valor no está vacío
    const parsedValue =
      name === "numeroDeTarjeta" ||
      name === "codigoDeSeguridad" ||
      name === "telefono"
        ? value === ""
          ? ""
          : parseFloat(value)
        : value;
    setMethodSelected((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));
  };

  return (
    <Grid container spacing={1.5}>
      <Grid item xs={12}>
        <TextField
          label="Nº de Tarjeta"
          name="numeroDeTarjeta"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.numeroDeTarjeta || ""}
          type="number"
          sx={{
            marginTop: 1.5,
            "& input[type=number]": {
              MozAppearance: "textfield",
              "&::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            },
          }}
          disabled={!selectedInvoice}
        />
      </Grid>

      <Grid item xs={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Vencimiento"
            value={expirationDate}
            required
            onChange={(date) => {
              handleExpirationDateChange(date);
            }}
            slotProps={{
              textField: { variant: "outlined" },
            }}
            sx={{ width: "100%" }}
            disabled={!selectedInvoice}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Codigo"
          name="codigoDeSeguridad"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.codigoDeSeguridad || ""}
          type="number"
          sx={{
            "& input[type=number]": {
              MozAppearance: "textfield",
              "&::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            },
          }}
          disabled={!selectedInvoice}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Nombre"
          name="nombre"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.nombre}
          disabled={!selectedInvoice}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Apellido"
          name="apellido"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.apellido}
          disabled={!selectedInvoice}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Pais"
          name="pais"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.pais}
          disabled={!selectedInvoice}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Localidad"
          name="localidad"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.localidad}
          disabled={!selectedInvoice}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Direccion"
          name="direccionDeFacturacion"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.direccionDeFacturacion}
          disabled={!selectedInvoice}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Telefono"
          name="telefono"
          required
          fullWidth
          autoComplete="off"
          onChange={handleChange}
          value={methodSelected.telefono || ""}
          type="number"
          sx={{
            "& input[type=number]": {
              MozAppearance: "textfield",
              "&::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            },
          }}
          disabled={!selectedInvoice}
        />
      </Grid>
    </Grid>
  );
}

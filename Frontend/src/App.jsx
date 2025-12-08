import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AlertX from "./components/AlertX";
import React from "react";
import Appbar from "./components/Appbar";
import ProductsPage from "./Pages/ProductsPage";
import HomePage from "./Pages/HomePage";
import PaymentsPage from "./Pages/PaymentsPage";
import InvoicesPage from "./Pages/InvoicesPage";
import ClientsPage from "./Pages/ClientsPage";

export default function App() {
  // tema
  const [colorMode, setColorMode] = useState(
    localStorage.getItem("theme") === "light" ? "light" : "dark"
  );
  const changeColorMode = () => {
    if (colorMode === "light") {
      setColorMode("dark");
      localStorage.setItem("theme", "dark");
    } else if (colorMode === "dark") {
      setColorMode("light");
      localStorage.setItem("theme", "light");
    }
  };

  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary:
        colorMode === "light"
          ? {
              main: "#4E4035",
            }
          : {
              main: "#ffffff",
            },
      secondary: {
        main: "#4E4035",
      },
    },
  });

  // alerta
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const showAlert = (message, severity, icon) => {
    setSnackPack((prev) => [
      ...prev,
      { message, severity, icon, key: new Date().getTime() },
    ]);
  };

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Appbar {...{ changeColorMode, colorMode }} />
        <AlertX
          {...{
            messageInfo,
            setMessageInfo,
            snackPack,
            setSnackPack,
            open,
            setOpen,
          }}
        />
        <Box
          marginTop={4}
          sx={{
            marginX: { xs: 2, sm: 5, md: 10, lg: 15 },
          }}
        >
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/products"
              element={<ProductsPage showAlert={showAlert} />}
            />
            <Route
              path="/clients"
              element={<ClientsPage showAlert={showAlert} />}
            />
            <Route
              path="/invoices"
              element={<InvoicesPage showAlert={showAlert} />}
            />
            <Route
              path="/payment"
              element={<PaymentsPage showAlert={showAlert} />}
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

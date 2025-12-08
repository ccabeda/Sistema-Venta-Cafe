import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import cafe_icon from "../assets/cafe_icon.png";
import { Link, useLocation } from "react-router-dom";

export default function Appbar({ changeColorMode, colorMode }) {
  const location = useLocation();

  return (
    <AppBar
      position="static"
      color={colorMode === "light" ? "secondary" : "default"}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            display="flex"
            alignItems={"center"}
            onClick={() => {}}
            sx={{
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
            component={Link}
            to="/home"
          >
            <img
              src={cafe_icon}
              style={{ width: 45, marginRight: 10 }}
              alt="cafe_icon"
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                marginTop: 0.6,
                marginLeft: 0.3,
                fontFamily: "Georgia, serif",
              }}
            >
              Café El Mejor
            </Typography>
          </Box>

          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Button
              sx={{
                my: 2,
                color: "inherit",
                display: "block",
                borderBottom:
                  location.pathname === "/products"
                    ? "2px solid white"
                    : "none",
                marginLeft: 1,
              }}
              component={Link}
              to="/products"
            >
              Productos
            </Button>
            <Button
              onClick={() => {}}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                borderBottom:
                  location.pathname === "/clients" ? "2px solid white" : "none",
                marginLeft: 1,
              }}
              component={Link}
              to="/clients"
            >
              Clientes
            </Button>
            <Button
              onClick={() => {}}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                borderBottom:
                  location.pathname === "/invoices"
                    ? "2px solid white"
                    : "none",
                marginLeft: 1,
              }}
              component={Link}
              to="/invoices"
            >
              Facturas
            </Button>
            <Button
              onClick={() => {}}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                borderBottom:
                  location.pathname === "/payment" ? "2px solid white" : "none",
                marginLeft: 1,
              }}
              component={Link}
              to="/payment"
            >
              Cobranza
            </Button>

            <Box onClick={changeColorMode} marginLeft={1}>
              <Tooltip
                title={colorMode === "dark" ? "Modo Oscuro" : "Modo Claro"}
                arrow
              >
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={changeColorMode}
                >
                  {colorMode === "dark" ? (
                    <DarkModeOutlined />
                  ) : (
                    <LightModeRounded />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

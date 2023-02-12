import Head from "next/head";
import Image from "next/image";
import Stock from "@/components/stock/Stock";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchStockData } from "@/features/stock/stockSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStockSelector";
import { Alert, CircularProgress, IconButton } from "@mui/material";
import { ClosedCaption } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Container } from "@mui/system";

const inter = Inter({ subsets: ["latin"] });

///const [stock, setStock] = useState(null);

export default function Home() {
  // const getStockData = async () => {
  //   const data = await fetch("https://localhost:7167/api/Stocks");
  //   const results = await data.json();
  //   // setStock(results);
  // };
  const [hasError, setHasError] = useState(false);
  const dispatch = useAppDispatch();
  const { stocks, error, loading } = useAppSelector((state) => state);

  const closeAlert = () => {
    setHasError(false);
  };

  useEffect(() => {
    dispatch(fetchStockData());

    console.log(stocks);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  return (
    <>
      <Container>
        {loading && <CircularProgress color='success' />}

        {hasError && (
          <Alert
            severity='error'
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={closeAlert}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Something went wrong, Please try again later!
          </Alert>
        )}
        {!error && stocks.length > 0 && <Stock stocks={stocks} />}
      </Container>
    </>
  );
}

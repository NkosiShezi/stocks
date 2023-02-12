import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getData = async () => {
    console.log("url", url);
    try {
      const data = await axios.get(url);
      setData(data.data);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      setError("something went wrong");
    }
  };

  useEffect(() => {
    getData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;

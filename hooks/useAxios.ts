import axios from "axios";
import { useEffect, useRef, useState } from "react";

type UseAxiosProps = {
  url: string;
  method?: "get" | "post" | "put" | "delete";
  payload?: any;
}

type UseAxiosReturnType<T> = {
  cancel: () => void;
  data: T | null;
  error: string;
  loaded: boolean;
}

// https://blog.openreplay.com/integrating-axios-with-react-hooks/
const useAxios = <T>({ url, method = 'get', payload }: UseAxiosProps): UseAxiosReturnType<T> => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.request({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url,
        });

        setData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, [url, method, payload]);

  return { cancel, data, error, loaded };
};

export default useAxios;

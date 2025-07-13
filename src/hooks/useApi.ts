import { useCallback } from "react";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

interface ApiGetOptions {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined | null>;
}

export function useApi() {
  const apiGet = useCallback(
    async (
      endpoint: string,
      options: ApiGetOptions = {}
    ) => {
      const { headers, query } = options;
      let url = `https://humble-couscous-g4p5jrv95pj6cw569-8000.app.github.dev/api/v1${endpoint}`;
      if (query && Object.keys(query).length > 0) {
        const params = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        url += `?${params.toString()}`;
      }

      console.log('Fetching from:', url);

      const config: AxiosRequestConfig = {};
      if (headers) {
        config.headers = headers;
      }

      const response = await axios.get(url, config);
      return response.data;
    },
    []
  );

  return { apiGet };
}

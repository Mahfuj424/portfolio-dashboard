import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypeList } from "../tagTypes";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://portfolio-backend-eight-black.vercel.app/api/v1`,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypeList,
});

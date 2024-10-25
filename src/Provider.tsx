/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const ProviderPage = ({ children }: any) => {
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
};

export default ProviderPage;

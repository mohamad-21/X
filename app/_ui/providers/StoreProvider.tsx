"use client";

import { useAppSelector } from "@/app/_lib/hooks";
import { AppStore, store } from "@/app/_lib/store";
import React, { useRef } from "react";
import { Provider } from "react-redux";
import PageLockLoading from "../PageLockLoading";

function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = store();
  }

  return (
    <Provider store={storeRef.current}>
      <AppProvider>
        {children}
      </AppProvider>
    </Provider>
  );
};

function AppProvider({ children }: { children: React.ReactNode }) {
  const { isChangingRoute } = useAppSelector(state => state.app);
  return (
    <>
      {isChangingRoute && (
        <PageLockLoading />
      )}
      {children}
    </>
  )
}

export default StoreProvider;

"use client";

import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import { setNotifications } from "@/app/_lib/slices/appSlice";
import { AppStore, store } from "@/app/_lib/store";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import { Modal } from "@nextui-org/modal";
import React, { useRef } from "react";
import { Provider } from "react-redux";
import useSWR from "swr";
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
  const dispatch = useAppDispatch();
  useSWR('/api/user/notifications', async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/notifications`);
    const data = await res.json();
    if (data) {
      dispatch(setNotifications(data));
    }
  }, {
    refreshInterval: 20000
  });

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

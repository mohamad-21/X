"use client";

import { useAppDispatch } from "../_lib/hooks";
import useSWR from "swr";
import { setNotifications } from "../_lib/slices/appSlice";

function NotificationsUpdater() {
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

  return null;
}

export default NotificationsUpdater;
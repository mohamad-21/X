"use client";

import { useAppDispatch } from "../_lib/hooks";
import useSWR from "swr";
import { setNotifications } from "../_lib/slices/appSlice";
import { refreshInterval } from "../_lib/swr";

function NotificationsUpdater() {
  const dispatch = useAppDispatch();
  useSWR('/api/user/notifications', async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/notifications`);
    const data = await res.json();
    if (data) {
      dispatch(setNotifications(data));
    }
  }, {
    refreshInterval: refreshInterval * 3
  });

  return null;
}

export default NotificationsUpdater;
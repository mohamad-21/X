import { getTwittById, getUserNotifications, readNotifications } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import Notifications from "./Notifications";

async function NotificationsWrapper() {
  const session = await auth();
  if (!session) return;
  let [userNotifications] = await Promise.all([
    getUserNotifications(session.user.id),
    readNotifications({ user: session.user })
  ])

  userNotifications = await Promise.all(userNotifications.map(async notif => {
    if (notif.type === 'like' && notif.place_id) {
      notif.twitt = await getTwittById(notif.place_id);
    }
    return notif;
  }));

  return (
    <ul>
      {userNotifications.map(notif => (
        <li key={notif.id}>
          <Notifications notif={notif} user={session.user} />
        </li>
      ))}
    </ul>
  )
}

export default NotificationsWrapper;

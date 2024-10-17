import { getTwittById, getTwittsByIds, getUserNotifications, readNotifications } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import Notifications from "./Notifications";

async function NotificationsWrapper() {
  const session = await auth();
  if (!session) return;
  let [userNotifications] = await Promise.all([
    getUserNotifications(session.user.id),
    readNotifications({ user: session.user })
  ])

  const placeIds = userNotifications.filter(notif => notif.type === 'like' && notif.place_id)
    .map(notif => notif.place_id);

  if (placeIds.length) {
    const twittsData = await getTwittsByIds(placeIds as (number | string)[]);

    userNotifications = userNotifications.map(notif => {
      if (notif.type === 'like' && notif.place_id) {
        notif.twitt = twittsData.find(tweet => tweet.id === notif.place_id);
      }
      return notif;
    })
  }

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

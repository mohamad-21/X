import { Metadata } from "next";
import { auth } from "../_lib/auth";
import PremiumSignup from "./PremiumSignup";
import { getUserDetailsById } from "../_lib/actions";
import { redirect } from "next/navigation";

const features = [
  {
    subscribeType: "Basic",
    duration: "month",
    features: [
      "Small reply boost",
      "Encrypted direct messages",
      "Bookmark folders",
      "Highlights tab",
      "Edit post",
      "Post longer videos",
      "Longer posts"
    ],
    price: 4.88
  },
  {
    subscribeType: "Premium",
    duration: "month",
    features: [
      "Half Ads in For You and Following",
      "Larger reply boost",
      "Get paid to post",
      "Checkmark",
      "Grok with increased limits",
      "X Pro, Analytics, Media Studio",
      "Creator Subscriptions"
    ],
    price: 13
  },
  {
    subscribeType: "Premium+",
    duration: "month",
    features: [
      "Fully ad-free",
      "Largest reply boost",
      "Write Articles",
      "Radar",
      "Compare tiers & features"
    ],
    price: 35
  },
]

type Props = {
  searchParams?: { [searchTerm: string]: string | undefined }
}

export const metadata: Metadata = {
  title: "Subscribe to premium"
}

async function PremiumSignupPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/");
  const params = searchParams;
  const isSubscribed = Boolean(params?.subscription && params?.subscription === "success");

  const user = await getUserDetailsById(session.user.id);
  if (!user) return null;

  return (
    <div>
      <PremiumSignup user={user} isSubscribed={isSubscribed} />
    </div>
  )
}

export default PremiumSignupPage;

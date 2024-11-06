import { ITwitt, UserData } from "@/app/_lib/definitions";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { LuRepeat2 } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiEyeLine } from "react-icons/ri";
import Alert from "./Alert";
const numeral = require("numeral");

type Props = {
  twitt: ITwitt;
  user: UserData;
  onCommentsClick?: () => any;
  onRetwitt?: () => any;
  onLike?: () => any;
  onBookmark?: () => any;
  className?: string;
};

function TwittActions({
  twitt,
  user,
  onCommentsClick,
  onRetwitt,
  onLike,
  className,
  onBookmark,
}: Props) {
  const [showUnavailable, setShowUnavailable] = useState(false);

  useEffect(() => {
    if (showUnavailable) {
      setTimeout(() => setShowUnavailable(false), 5000);
    }
  }, [showUnavailable]);

  return (
    <div
      className={`flex items-center gap-4 justify-between to-twitt ${className}`}
    >
      <Button
        onClick={onCommentsClick}
        variant="bordered"
        className="flex items-center text-default-400 hover:bg-transparent hover:text-primary border-none group gap-0 transition-all duration-150 min-w-0 px-0"
      >
        <div className="rounded-full py-1.5 px-2 group-hover:bg-primary/20">
          <FaRegComment size={17} className="relative" />
        </div>
        {twitt.comments.length > 0 && (
          <span className="text-sm">{twitt.comments.length}</span>
        )}
      </Button>
      <Button
        variant="bordered"
        className="flex items-center text-default-400 hover:bg-transparent hover:text-emerald-400 border-none group gap-0 transition-all duration-150 min-w-0 px-0"
        onClick={onRetwitt}
      >
        <div className="rounded-full py-1.5 px-2 group-hover:bg-emerald-400/20">
          {twitt.retwitts.some((retwitt) => retwitt == user.id) ? (
            <LuRepeat2 className="text-emerald-400" size={20} />
          ) : (
            <LuRepeat2 size={20} />
          )}
        </div>
        {twitt.retwitts.length > 0 && (
          <span
            className={`text-sm ${
              twitt.retwitts.some((retwitt) => retwitt == user.id)
                ? "text-emerald-400"
                : ""
            }`}
          >
            {twitt.retwitts.length}
          </span>
        )}
      </Button>
      <Button
        type="submit"
        variant="bordered"
        className="flex items-center text-default-400 hover:bg-transparent hover:text-pink-600 border-none group gap-0 transition-all duration-150 min-w-0 px-0"
        onClick={onLike}
      >
        <div className="rounded-full py-1.5 px-2 group-hover:bg-pink-600/20">
          {twitt.likes.some((like) => like == user.id) ? (
            <FaHeart className="text-rose-500" size={15.5} />
          ) : (
            <FaRegHeart size={15.5} />
          )}
        </div>

        {twitt.likes.length > 0 && (
          <span
            className={`text-sm ${
              twitt.likes.some((like) => like == user.id) ? "text-rose-500" : ""
            }`}
          >
            {twitt.likes.length}
          </span>
        )}
      </Button>
      <Button
        variant="bordered"
        className="flex items-center text-default-400 hover:bg-transparent hover:text-primary border-none group gap-0 transition-all duration-150 min-w-0 px-0"
      >
        <div className="rounded-full py-1.5 px-2 group-hover:bg-primary/20">
          <RiEyeLine size={15} />
        </div>
        <span className="text-sm">
          {numeral(twitt.views.length).format("0a")}
        </span>
      </Button>
      <div className="flex items-center">
        <Button
          isIconOnly
          radius="full"
          size="sm"
          variant="bordered"
          className="flex items-center text-default-400 hover:bg-transparent hover:text-primary border-none group gap-0 transition-all duration-150 min-w-0 px-0"
          onClick={onBookmark}
        >
          <div className="rounded-full py-1.5 px-2 group-hover:bg-primary/20">
            {user.bookmarks.some((bookmark) => bookmark.id == twitt.id) ? (
              <GoBookmarkFill className="text-primary" size={20} />
            ) : (
              <GoBookmark size={20} />
            )}
          </div>
        </Button>
        {/* <Button
          isIconOnly
          radius="full"
          size="sm"
          variant="bordered"
          className="flex items-center text-default-400 hover:bg-transparent hover:text-primary border-none group gap-0 transition-all duration-150 min-w-0 px-0"
        >
          <div
            className="rounded-full py-1.5 px-2 group-hover:bg-primary/20"
            onClick={() => setShowUnavailable(true)}
          >
            <MdOutlineFileUpload size={20} />
          </div>
        </Button> */}
      </div>
      {showUnavailable && (
        <Alert type="fixed">This action is not available for now.</Alert>
      )}
    </div>
  );
}

export default TwittActions;

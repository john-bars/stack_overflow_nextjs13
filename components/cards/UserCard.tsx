import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface Props {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    picture: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border  rounded-2xl border p-8">
        <Link
          href={`/profile/${user._id}`}
          className="flex w-full flex-col items-center justify-center"
        >
          <Image
            src={user.picture}
            alt={`${user.name} profile picture`}
            width={100}
            height={100}
            className="rounded-full"
          />

          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{user.username}
            </p>
          </div>
        </Link>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex justify-between">
              {interactedTags.map((tag) => (
                <RenderTag
                  key={tag._id.toString()}
                  _id={tag._id.toString()}
                  name={tag.name}
                />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;

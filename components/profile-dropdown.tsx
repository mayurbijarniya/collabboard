import { signOut } from "next-auth/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/app/contexts/UserContext";

type Props = {
  user: User | null;
};

export function ProfileDropdown({ user }: Props) {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="w-9 h-9 cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
            <AvatarImage
              className="w-8.5 h-8.5 rounded-full"
              src={user?.image || ""}
              alt={user?.name || ""}
            />
            <AvatarFallback className="w-8 h-8 flex items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase()}
              </span>
            </AvatarFallback>
          </div>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-lg shadow-lg border p-2">
        <div className="p-2">
          <p className="font-medium text-foreground">
            {user?.name || user?.email}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <div className="border-t my-1"></div>
        <div className="flex flex-col gap-1">
          <Link
            href={"/settings"}
            className="rounded-lg block font-medium px-3 py-1.5 text-sm hover:text-primary-foreground hover:bg-primary text-foreground"
          >
            Settings
          </Link>

          <div
            onClick={handleSignOut}
            className="rounded-lg block font-medium px-3 py-1.5 text-sm hover:text-primary-foreground hover:bg-primary cursor-pointer"
          >
            Sign out
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

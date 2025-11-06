import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "../../sections/profile-tab";
import TeamTab from "../../sections/team-tab";
import AccountTab from "../../sections/account-tab";
import { useArtistProfile } from "../../../hooks/use-artist-profile";

export default function Tab() {
  const { isSolo } = useArtistProfile();

  return (
    <div className="mt-2 md:mt-4">
      <Tabs defaultValue="profile">
        <TabsList className="h-auto bg-transparent p-0">
          <TabsTrigger value="profile" className="text-muted-foreground px-3 py-2 text-sm font-medium">
            Profile
          </TabsTrigger>
          {!isSolo && (
            <TabsTrigger value="team" className="text-muted-foreground px-3 py-2 text-sm font-medium">
              Team
            </TabsTrigger>
          )}
          <TabsTrigger value="account" className="text-muted-foreground px-3 py-2 text-sm font-medium">
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        {!isSolo && (
          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
        )}
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

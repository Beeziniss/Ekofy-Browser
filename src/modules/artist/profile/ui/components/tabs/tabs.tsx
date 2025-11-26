import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "../../sections/profile-tab";
import TeamTab from "../../sections/team-tab";
import AccountTab from "../../sections/account-tab";
import type { UserGender } from "@/gql/graphql";

interface TabProps {
  isSolo: boolean;
  artistData: {
    members?: Array<{
      fullName: string;
      email: string;
      isLeader?: boolean;
    }>;
    data?: {
      stageName?: string;
    };
    createdAt?: string;
    userStatus?: string;
    artistType?: string;
    membershipStatus?: string;
    identityCard?: {
      number?: string;
      fullName?: string;
      dateOfBirth?: string;
      gender?: UserGender;
      placeOfOrigin?: string;
      placeOfResidence?: {
        addressLine?: string;
      };
      validUntil?: string;
    };
  };
}

export default function Tab({ isSolo, artistData }: TabProps) {
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
            <TeamTab members={artistData.members} />
          </TabsContent>
        )}
        <TabsContent value="account">
          <AccountTab artistData={artistData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

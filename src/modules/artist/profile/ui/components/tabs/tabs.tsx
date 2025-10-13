import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileTab from '../../sections/profile-tab';
import TeamTab from '../../sections/team-tab'
import AccountTab from '../../sections/account-tab'
export default function Tab() {
  return (
    <div className="mt-2 md:mt-4">
            <Tabs defaultValue="profile">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="profile"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground"
                >
                  Team
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground"
                >
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileTab />
              </TabsContent>
              <TabsContent value="team">
                <TeamTab />
              </TabsContent>
              <TabsContent value="account">
                <AccountTab />
              </TabsContent>
            </Tabs>
          </div>
  );
}

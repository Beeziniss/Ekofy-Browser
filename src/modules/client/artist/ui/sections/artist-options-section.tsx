import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ArtistOptionsSection = () => {
  return (
    <div className="grid grid-cols-5 px-6 py-2">
      <div className="col-span-4">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">
            Change your password here. Change your password here. Change your
            password here. Change your password here. Change your password here.
          </TabsContent>
        </Tabs>
      </div>
      <div className="col-span-1">ehe</div>
    </div>
  );
};

export default ArtistOptionsSection;

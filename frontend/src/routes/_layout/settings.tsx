import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { UserPublic } from "../../client";
import Appearance from "../../components/UserSettings/Appearance";
import ChangePassword from "../../components/UserSettings/ChangePassword";
import DeleteAccount from "../../components/UserSettings/DeleteAccount";
import UserInformation from "../../components/UserSettings/UserInformation";

const tabsConfig = [
  { title: "My profile", component: UserInformation },
  { title: "Password", component: ChangePassword },
  { title: "Appearance", component: Appearance },
  { title: "Danger zone", component: DeleteAccount },
];

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
});

function UserSettings() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, 3)
    : tabsConfig;

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center md:text-left py-6">
            User Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={finalTabs[0]?.title}>
            <TabsList className="flex space-x-2">
              {finalTabs.map((tab, index) => (
                <TabsTrigger key={index} value={tab.title}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {finalTabs.map((tab, index) => (
              <TabsContent key={index} value={tab.title}>
                <tab.component />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

import { Settings2Icon, UserIcon, BellIcon, ShieldCheckIcon, GlobeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
              <UserIcon className="size-5" />
            </div>
            <CardTitle className="mt-4">Account Profile</CardTitle>
            <CardDescription>Update your personal information and profile picture.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
              <BellIcon className="size-5" />
            </div>
            <CardTitle className="mt-4">Notifications</CardTitle>
            <CardDescription>Configure how you want to receive stock alerts.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
              <ShieldCheckIcon className="size-5" />
            </div>
            <CardTitle className="mt-4">Security</CardTitle>
            <CardDescription>Change your password and enable two-factor auth.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Application Preferences</h3>
          <p className="text-sm text-muted-foreground">Customize how Stockr looks and behaves.</p>
        </div>
        <Separator />
        <div className="grid gap-4">
           <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-4">
                 <GlobeIcon className="size-5 text-muted-foreground" />
                 <div>
                    <p className="font-medium">Language</p>
                    <p className="text-xs text-muted-foreground">Default: English (US)</p>
                 </div>
              </div>
              <Button variant="outline">Change</Button>
           </div>
        </div>
      </div>
    </div>
  )
}

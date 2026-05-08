"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
    });
    setLoading(false);
    if (error) {
      alert(error.message || "Something went wrong");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });
    setLoading(false);
    if (error) {
      alert(error.message || "Invalid credentials");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Card className="w-[400px] shadow-2xl border-none bg-white/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Stockr
        </CardTitle>
        <CardDescription className="text-center">
          Manage your business with confidence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="yves@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSignIn} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                placeholder="Yves Mugisha"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="yves@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSignUp} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground flex justify-center">
        By continuing, you agree to Stockr&apos;s Terms of Service.
      </CardFooter>
    </Card>
  );
}

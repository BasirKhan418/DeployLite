import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Toaster, toast } from "sonner";
import { get } from "http";
const Notification = () => {
  //STATES
  const [loading,setLoading] = useState(false)
  const [email,setEmail] = useState('') 
  const [form, setForm] = useState({
    buildfailure: false,
    deployment: false,
    emailnotification: false,
    inapp: false,
    securityalerts: false,
    slacknotification: false,
    sms: false,
  });
  const GetNotification = async () => {
    try {
      setLoading(true)
      let res = await fetch("/api/notification/crud");
      let result = await res.json();
      setLoading(false)
      if (result.success) {
        console.log(result);
        setForm({
          buildfailure: result.data.buildfailure,
          deployment: result.data.deployment,
          emailnotification: result.data.emailnotification,
          inapp: result.data.inapp,
          securityalerts: result.data.securityalerts,
          slacknotification: result.data.slacknotification,
          sms: result.data.sms,
        });
        setEmail(result.data.email)
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(
        "An error occured while fetching the notification preferences."
      );
    }
  };
  useEffect(() => {
    GetNotification();
  }, []);
  const UpdatePreferences = async (newform:{}) => {
    try {
      let res = await fetch("/api/notification/crud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newform),
      });
      let result = await res.json();
      if (result.success) {
        toast.success(result.message);
        GetNotification();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("An error occured while updating the notification preferences.");
    }
  }
  //update the notification preferences on change
  return (
    <div>
      <Toaster position="top-right" />
     {loading?<div>Loading...</div>: <>
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how and when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="deploymentNotifications">
                Deployment Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts for deployment status changes
              </p>
            </div>
            <Switch id="deploymentNotifications" defaultChecked={form.deployment} onCheckedChange={()=>{
             let newdata = {...form,deployment:!form.deployment}

              UpdatePreferences(newdata)
            }}/>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="buildFailures">Build Failure Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when builds fail
              </p>
            </div>
            <Switch id="buildFailures" defaultChecked={form.buildfailure} onCheckedChange={()=>{
              let newdata = {...form,buildfailure:!form.buildfailure}
              UpdatePreferences(newdata)
            }}/>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="securityAlerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive important security notifications
              </p>
            </div>
            <Switch id="securityAlerts" defaultChecked={form.securityalerts} onCheckedChange={()=>{
              let newdata = {...form,securityalerts:!form.securityalerts}
              UpdatePreferences(newdata)
            }}/>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Choose how you want to receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <Switch defaultChecked={form.emailnotification} onCheckedChange={()=>{
              let newdata = {...form,emailnotification:!form.emailnotification}
              UpdatePreferences(newdata)
            }}/>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>In App Notification</Label>
              <p className="text-sm text-muted-foreground">app.deploylite.tech</p>
            </div>
            <Switch defaultChecked={form.inapp} onCheckedChange={()=>{
              let newdata = {...form,inapp:!form.inapp}
              UpdatePreferences(newdata)
            }}/>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Connected to #deployments channel
              </p>
            </div>
            <Switch defaultChecked={form.slacknotification} onCheckedChange={()=>{
              toast.info("Feature is under development");
            }}/>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Not configured</p>
            </div>
            <Button variant="outline" size="sm" onClick={()=>{
              toast.info("Feature is under development");
            }}>
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
      </>
      }
    </div>
  );
};

export default Notification;

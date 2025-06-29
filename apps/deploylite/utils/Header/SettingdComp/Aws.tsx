"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { Toaster, toast } from "sonner";
import { FaAws } from "react-icons/fa6";
import { SiGooglecloud } from "react-icons/si";
import AwsModal from "@/utils/modals/AwsModal";
import { FaMicrosoft } from "react-icons/fa";
import { useAppDispatch } from "@/lib/hook";
import { add } from "@/lib/features/aws/aws";
import { useAppSelector } from "@/lib/hook";
import LoginLoader from "@/utils/Loaders/LoginLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Aws = () => {
  const [isconnected, setIsconnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const aws = useAppSelector((state) => state.aws.aws);
  const [isupdate, setisUpdate] = useState(false);
  const [alertopen, setAlertOpen] = useState(false);
  const dispatch = useAppDispatch();
  
  const checkAws = async () => {
    try {
      const res = await fetch("/api/cutomization/aws");
      const data = await res.json();
      if (data.aws) {
        setIsconnected(true);
        dispatch(add(data.data));
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong please try again after some time");
    }
  };
  
  //useeffect for checking if aws account is connected or not
  useEffect(() => {
    checkAws();
  }, []);
  
  //disconnect aws account
  const disconnectAws = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cutomization/aws", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setIsconnected(false);
        dispatch(add({}));
        setIsconnected(false);
        setAlertOpen(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong please try again after some time");
    }
  };
  
  //update aws configuration
  const updateConfiguration = async (data: any) => {
    try {
      let res = await fetch("/api/cutomization/aws", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let result = await res.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong please try again after some time");
    }
  };

  return (
    <div>
      <AwsModal open={open} setOpen={setOpen} isupdate={isupdate} />
      <Toaster position="top-right" />
      <Card>
        <CardHeader>
          <CardTitle>Customizable Cloud Integration</CardTitle>
          <CardDescription>
            Connect and manage your AWS,GCP and Azure services to deploy your
            application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaAws className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">AWS Account</p>
                <p className="text-sm text-muted-foreground">
                  {isconnected ? "Connected" : "Connect Now"}
                </p>
              </div>
            </div>
            {isconnected && (
              <Button
                variant={"outline"}
                onClick={() => {
                  setAlertOpen(true);
                }}
              >
                {loading ? <LoginLoader /> : "Disconnect"}
              </Button>
            )}
            {!isconnected && (
              <Button
                onClick={() => {
                  setOpen(true);
                }}
              >
                Connect Now
              </Button>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SiGooglecloud className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">GCP Account</p>
                <p className="text-sm text-muted-foreground">Connect Now</p>
              </div>
            </div>
            <Button
              onClick={() => {
                toast.info(
                  "This feature is not available yet.Try to connect with AWS ."
                );
              }}
            >
              Connect Now
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaMicrosoft className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">Microsoft Azure Account</p>
                <p className="text-sm text-muted-foreground">Connect Now</p>
              </div>
            </div>
            <Button
              onClick={() => {
                toast.info(
                  "This feature is not available yet.Try to connect with AWS ."
                );
              }}
            >
              Connect Now
            </Button>
          </div>
          <Separator />

          {isconnected && (
            <div className="space-y-2">
              <Label htmlFor="awsRegion">AWS Region</Label>
              <Select
                value={aws?.region || ""}
                onValueChange={(value) =>
                  updateConfiguration({ region: value })
                }
              >
                <SelectTrigger id="awsRegion">
                  <SelectValue placeholder="Select AWS Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ap-south-1">
                    Asia Pacific (Mumbai)
                  </SelectItem>
                  <SelectItem value="us-east-1">
                    US East (N. Virginia)
                  </SelectItem>
                  <SelectItem value="us-west-1">
                    US West (N. California)
                  </SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                  <SelectItem value="ap-southeast-1">
                    Asia Pacific (Singapore)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {isconnected && (
            <>
              <div className="space-y-2">
                <Label htmlFor="awsAccessKey">AWS Access Key ID</Label>
                <Input
                  id="awsAccessKey"
                  placeholder="Enter your AWS Access Key ID"
                  value={aws?.awskey || ""}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awsSecretKey">AWS Secret Access Key</Label>
                <Input
                  id="awsSecretKey"
                  type="password"
                  placeholder="Enter your AWS Secret Access Key"
                  value={aws?.awssecret || ""}
                  readOnly
                />
              </div>
            </>
          )}
        </CardContent>
        {isconnected && (
          <CardFooter>
            <Button
              onClick={() => {
                setisUpdate(true);
                setOpen(true);
              }}
            >
              Update AWS Configuration
            </Button>
          </CardFooter>
        )}
      </Card>

      {isconnected && (
        <Card>
          <CardHeader>
            <CardTitle>AWS Services</CardTitle>
            <CardDescription>
              Manage AWS services integrated with your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Amazon S3</p>
                <p className="text-sm text-muted-foreground">
                  File storage service
                </p>
              </div>
              <Switch
                id="s3Service"
                checked={!!aws?.s3}
                onCheckedChange={() => {
                  updateConfiguration({ s3: !aws?.s3 });
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Amazon EC2</p>
                <p className="text-sm text-muted-foreground">Compute service</p>
              </div>
              <Switch
                id="ec2Service"
                checked={!!aws?.ec2}
                onCheckedChange={() => {
                  updateConfiguration({ ec2: !aws?.ec2 });
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Amazon Fargate</p>
                <p className="text-sm text-muted-foreground">
                  Run Containers without Managing Infrastructure
                </p>
              </div>
              <Switch
                id="rdsService"
                checked={!!aws?.fargate}
                onCheckedChange={() => {
                  updateConfiguration({ fargate: !aws?.fargate });
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Amazon ECS (Elastic Container Service)
                </p>
                <p className="text-sm text-muted-foreground">
                  Highly secure, reliable, and scalable way to run containers
                </p>
              </div>
              <Switch
                id="rdsService"
                checked={!!aws?.ecs}
                onCheckedChange={() => {
                  updateConfiguration({ ecs: !aws?.ecs });
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Amazon ECR (Elastic Container Registry)
                </p>
                <p className="text-sm text-muted-foreground">
                  Fully-managed Docker container registry : Share and deploy
                  container software
                </p>
              </div>
              <Switch
                id="rdsService"
                checked={!!aws?.ecr}
                onCheckedChange={() => {
                  updateConfiguration({ ecr: !aws?.ecr });
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={alertopen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently disconnect
              your AWS account from deploylite.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                disconnectAws();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Aws;
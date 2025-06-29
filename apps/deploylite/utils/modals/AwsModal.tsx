import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon, Lock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import LoginLoader from '../Loaders/LoginLoader'
import { Toaster,toast } from 'sonner'
import { useAppSelector } from '@/lib/hook'
import { useAppDispatch } from '@/lib/hook'
import { add } from '@/lib/features/aws/aws'

type ModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    isupdate:boolean;
  };

export default function AwsModal({open,setOpen,isupdate}:ModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const aws = useAppSelector(state=>state.aws.aws);
  const dispatch = useAppDispatch();
  const [form,setForm] = useState({
    awskey:"",
    awssecret:"",
    region:"",
    vpcid:"",
    subnetid1:"",
    subnetid2:"",
    subnetid3:"",
    securitygroupid:"",
    s3bucket:""
  })
  const [loading,setLoading] = useState(false)
  
  //useEffect for setting the form data
  useEffect(()=>{
    setForm({
      awskey:aws.awskey,
      awssecret:aws.awssecret,
      region:aws.region,
      vpcid:aws.vpcid,
      subnetid1:aws.subnetid1,
      subnetid2:aws.subnetid2,
      subnetid3:aws.subnetid3,
      securitygroupid:aws.securitygroupid,
      s3bucket:aws.s3bucket
    })
  },[isupdate,aws])
  
  //handlechnage
  const handleChange = async(e:any)=>{
    setForm({
      ...form,
      [e.target.id]:e.target.value
    })
  }
  
  //handleSubmit 
  const handleSubmit = async()=>{
    if(!termsAccepted){
      toast.error("Please accept the terms and conditions")
      return
    }
    if(form.awskey==""||form.awssecret==""||form.region==""||form.vpcid==""||form.subnetid1==""||form.subnetid2==""||form.subnetid3==""||form.securitygroupid==""||form.s3bucket==""){
      toast.error("Please fill all the fields")
      return
    }
    try{
      setLoading(true)
     const res = await fetch("/api/cutomization/aws",{
        method:"POST",
        body:JSON.stringify(form),
        headers:{
          "Content-Type":"application/json"
        }
     })
      const data = await res.json();
      setLoading(false);
      if(data.success){
        setOpen(false)
        toast.success(data.message)
        window.location.reload();
      }
      else{
        toast.error(data.message)
      }
    }
    catch(err){
      toast.error("Something Went Wrong Please try again after some time")
    }
  }
  
  //handle Update
  const handleUpdateInput = async()=>{
    try{
     if(!termsAccepted){
      toast.error("Please accept the terms and conditions")
      return
     }
      if(form.awskey==""||form.awssecret==""||form.region==""||form.vpcid==""||form.subnetid1==""||form.subnetid2==""||form.subnetid3==""||form.securitygroupid==""||form.s3bucket==""){
        toast.error("Please fill all the fields")
        return
      }
      setLoading(true)
      const res = await fetch("/api/cutomization/aws",{
          method:"PUT",
          body:JSON.stringify({...form,status:"updateinput"}),
          headers:{
            "Content-Type":"application/json"
          }
      })
      const data = await res.json();
      setLoading(false);
      if(data.success){
        setOpen(false)
        toast.success(data.message)
        dispatch(add(data.data))
      }
      else{
        toast.error(data.message)
      }
    }
    catch(err){
      toast.error("Something went wrong please try again after some time")
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster position="top-right"/>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">AWS Configuration</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Customize your AWS deployment settings. Please fill in the required information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="awsRegion">AWS Region</Label>
              <Select value={form.region} onValueChange={(value)=>{
                setForm({...form,region:value})
              }}>
                <SelectTrigger id="awsRegion">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                  <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                  <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                  <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                  {/* Add more regions as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Network Settings</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vpcid">VPC ID</Label>
                <Input id="vpcid" placeholder="vpc-xxxxxxxx" value={form.vpcid} onChange={handleChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subnetid1">Subnet 1</Label>
                <Input id="subnetid1" placeholder="subnet-xxxxxxxx" value={form.subnetid1} onChange={handleChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subnetid2">Subnet 2</Label>
                <Input id="subnetid2" placeholder="subnet-xxxxxxxx" value={form.subnetid2} onChange={handleChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subnet3">Subnet 3</Label>
                <Input id="subnetid3" placeholder="subnet-xxxxxxxx" value={form.subnetid3} onChange={handleChange}/>
              </div>
             
            </div>
            <div className="space-y-1">
                <Label htmlFor="securitygroupid">Security Group </Label>
                <Input id="securitygroupid" placeholder="security group id" value={form.securitygroupid} onChange={handleChange}/>
              </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">AWS Credentials</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="awskey">Access Key ID</Label>
                <Input id="awskey" placeholder="AKIAIOSFODNN7EXAMPLE" value={form.awskey} onChange={handleChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="awssecret">Aws Secret </Label>
                <Input id="awssecret" type="password" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" value={form.awssecret} onChange={handleChange}/>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Storage</h3>
            <div className="space-y-2">
              <Label htmlFor="s3bucket">S3 Bucket Name</Label>
              <Input id="s3bucket" placeholder="my-unique-bucket-name" value={form.s3bucket} onChange={handleChange}/>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md flex items-start space-x-3">
            <Lock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We are encrypting your keys using industry-standard encryption. Your data is end-to-end secure and never stored in plain text.
            </p>
          </div>
          
          <div className="flex items-start space-x-2">
            {/* @ts-ignore */}
            <Checkbox id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} className="mt-1" />
            <div>
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Please read our{' '}
                <Link href="/terms-and-conditions" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </Link>{' '}
                before proceeding.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-y-0 space-y-4">
          <div className="flex items-center">
            <InfoIcon className="w-4 h-4 mr-2 text-blue-500" />
            <a
              href="#"
              className="text-sm text-blue-500 hover:underline flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to set up AWS <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
          {!isupdate && (
            <Button type="submit" disabled={!termsAccepted} className="w-full sm:w-auto" onClick={handleSubmit}>
              {loading ? <LoginLoader /> : "Save Changes"}
            </Button>
          )}
          {isupdate && (
            <Button type="submit" disabled={!termsAccepted} className="w-full sm:w-auto" onClick={handleUpdateInput}>
              {loading ? <LoginLoader /> : "Update Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
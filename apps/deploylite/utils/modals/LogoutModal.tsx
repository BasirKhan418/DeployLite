
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import Logout from "@/actions/Logout"
type LogoutProps = {
    setIsOpen: (value: boolean) => void
    isOpen: boolean
}
export default function LogoutModal({setIsOpen, isOpen}:LogoutProps) {
    const router = useRouter();
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <LogOutIcon className="size-12 text-red-500" />
            <div className="space-y-2 text-center">
              <DialogTitle>Logout Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to logout? This will end your current session.
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => {setIsOpen(false)}} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async() => {
                setIsOpen(false)
                let result = await Logout()
                if(result){
                  router.push('/login')
                } 
              }}
              className="flex-1"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function LogOutIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}
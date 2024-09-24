"use client"
import { useState } from "react"
import { Bell, CreditCard, Github, Globe, Key, User, Zap, Shield, ChevronDown, Cloud, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const Biling = () => {
  return (
    <div>
       <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan: Pro</p>
                      <p className="text-sm text-muted-foreground">$29/month, billed monthly</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="billingEmail">Billing Email</Label>
                    <Input id="billingEmail" type="email" placeholder="billing@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="**** **** **** 1234" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Billing Information</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wallet</CardTitle>
                  <CardDescription>Manage your wallet balance and transactions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Balance</p>
                      <p className="text-2xl font-bold">$250.00</p>
                    </div>
                    <Button>
                      <Wallet className="mr-2 h-4 w-4" />
                      Recharge Wallet
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Recent Transactions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Jul 15, 2023</TableCell>
                          <TableCell>Wallet Recharge</TableCell>
                          <TableCell className="text-right">+$100.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jul 10, 2023</TableCell>
                          <TableCell>Monthly Subscription</TableCell>
                          <TableCell className="text-right">-$29.99</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jul 1, 2023</TableCell>
                          <TableCell>Wallet Recharge</TableCell>
                          <TableCell className="text-right">+$200.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View All Transactions</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your recent invoices and payment history.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Jul 1, 2023</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jun 1, 2023</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 1, 2023</TableCell>
                        <TableCell>Pro Plan - Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Download All Invoices</Button>
                </CardFooter>
              </Card>
    </div>
  )
}

export default Biling

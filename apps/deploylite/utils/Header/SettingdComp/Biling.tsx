"use client";
import { useState } from "react";
import {
  Bell,
  CreditCard,
  Github,
  Globe,
  Key,
  User,
  Zap,
  Shield,
  ChevronDown,
  Cloud,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/hook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const Biling = () => {
  const wallet = useAppSelector((state) => state.wallet.wallet);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>
            Manage your wallet balance and transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Balance</p>
              <p className="text-2xl font-bold">₹{wallet.balance.toFixed(2)}</p>
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
                {wallet.transactions.map((item: any, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(item.date)
                        .toLocaleString("en-IN", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(",", "")}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      {item.type == "credit"
                        ? `+₹${item.amount}`
                        : `-₹${item.amount}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View All Transactions</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Biling;

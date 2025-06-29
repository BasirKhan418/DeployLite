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
  
  // Ensure wallet exists and has default values
  const currentWallet = wallet || { balance: 0, transactions: [] };
  
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
              <p className="text-2xl font-bold">₹{(currentWallet.balance || 0).toFixed(2)}</p>
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
                {currentWallet.transactions && Array.isArray(currentWallet.transactions) && currentWallet.transactions.length > 0 ? (
                  currentWallet.transactions.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item?.date ? new Date(item.date)
                          .toLocaleString("en-IN", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", "") : "N/A"}
                      </TableCell>
                      <TableCell>{item?.description || "No description"}</TableCell>
                      <TableCell className="text-right">
                        {item?.type === "credit"
                          ? `+₹${item?.amount || 0}`
                          : `-₹${item?.amount || 0}`}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
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
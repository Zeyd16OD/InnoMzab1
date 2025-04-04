"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, Loader2, Plus, Minus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function InvestorWalletPage() {
  const { t, dir } = useLanguage()
  const { user, userRole } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
  })
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (userRole !== "investor") {
      router.push("/")
      return
    }

    const fetchWalletData = async () => {
      try {
        // Fetch wallet balance
        const { data: walletData, error: walletError } = await supabase
          .from("investor_wallets")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (walletError && walletError.code !== "PGRST116") {
          throw walletError
        }

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (transactionsError) {
          throw transactionsError
        }

        setWalletData({
          balance: walletData?.balance || 0,
          transactions: transactionsData || [],
        })
      } catch (error) {
        console.error("Error fetching wallet data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWalletData()
  }, [user, userRole, router])

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const amount = Number(depositAmount)

      // Add transaction
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount,
        type: "deposit",
        status: "completed",
        description: "إيداع رصيد في المحفظة",
      })

      if (transactionError) {
        throw transactionError
      }

      // Update wallet balance
      const { error: walletError } = await supabase.from("investor_wallets").upsert({
        user_id: user.id,
        balance: walletData.balance + amount,
      })

      if (walletError) {
        throw walletError
      }

      // Update local state
      setWalletData({
        balance: walletData.balance + amount,
        transactions: [
          {
            id: Date.now(),
            user_id: user.id,
            amount,
            type: "deposit",
            status: "completed",
            description: "إيداع رصيد في المحفظة",
            created_at: new Date().toISOString(),
          },
          ...walletData.transactions,
        ],
      })

      setDepositAmount("")
    } catch (error) {
      console.error("Error processing deposit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWithdraw = async () => {
    if (
      !withdrawAmount ||
      isNaN(Number(withdrawAmount)) ||
      Number(withdrawAmount) <= 0 ||
      Number(withdrawAmount) > walletData.balance
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const amount = Number(withdrawAmount)

      // Add transaction
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount,
        type: "withdrawal",
        status: "completed",
        description: "سحب رصيد من المحفظة",
      })

      if (transactionError) {
        throw transactionError
      }

      // Update wallet balance
      const { error: walletError } = await supabase.from("investor_wallets").upsert({
        user_id: user.id,
        balance: walletData.balance - amount,
      })

      if (walletError) {
        throw walletError
      }

      // Update local state
      setWalletData({
        balance: walletData.balance - amount,
        transactions: [
          {
            id: Date.now(),
            user_id: user.id,
            amount,
            type: "withdrawal",
            status: "completed",
            description: "سحب رصيد من المحفظة",
            created_at: new Date().toISOString(),
          },
          ...walletData.transactions,
        ],
      })

      setWithdrawAmount("")
    } catch (error) {
      console.error("Error processing withdrawal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">{t("loading")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-8 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold tracking-tighter">{t("wallet")}</h1>
            <p className="text-muted-foreground">إدارة محفظتك الاستثمارية</p>
          </div>
        </div>
      </section>

      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet Balance Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  {t("wallet-balance")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{walletData.balance.toLocaleString()} دج</div>
                <p className="text-sm text-muted-foreground mt-1">الرصيد المتاح للاستثمار</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      {t("add-funds")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("add-funds")}</DialogTitle>
                      <DialogDescription>أدخل المبلغ الذي ترغب في إضافته إلى محفظتك</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">المبلغ (دج)</label>
                        <Input
                          type="number"
                          placeholder="أدخل المبلغ"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleDeposit} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الإيداع...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            إيداع
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Minus className="mr-2 h-4 w-4" />
                      {t("withdraw-funds")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("withdraw-funds")}</DialogTitle>
                      <DialogDescription>أدخل المبلغ الذي ترغب في سحبه من محفظتك</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">المبلغ (دج)</label>
                        <Input
                          type="number"
                          placeholder="أدخل المبلغ"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          max={walletData.balance}
                        />
                        <p className="text-sm text-muted-foreground">
                          الرصيد المتاح: {walletData.balance.toLocaleString()} دج
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleWithdraw}
                        disabled={isSubmitting || Number(withdrawAmount) > walletData.balance}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري السحب...
                          </>
                        ) : (
                          <>
                            <Minus className="mr-2 h-4 w-4" />
                            سحب
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            {/* Transactions Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("transaction-history")}</CardTitle>
                <CardDescription>سجل معاملات المحفظة</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="deposits">إيداعات</TabsTrigger>
                    <TabsTrigger value="withdrawals">سحوبات</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    {renderTransactions(walletData.transactions)}
                  </TabsContent>

                  <TabsContent value="deposits" className="mt-4">
                    {renderTransactions(walletData.transactions.filter((t) => t.type === "deposit"))}
                  </TabsContent>

                  <TabsContent value="withdrawals" className="mt-4">
                    {renderTransactions(walletData.transactions.filter((t) => t.type === "withdrawal"))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )

  function renderTransactions(transactions) {
    if (transactions.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">لا توجد معاملات</div>
    }

    return (
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {transaction.type === "deposit" ? (
                <div className="bg-green-100 p-2 rounded-full">
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                </div>
              ) : transaction.type === "withdrawal" ? (
                <div className="bg-red-100 p-2 rounded-full">
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                </div>
              ) : (
                <div className="bg-blue-100 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div>
                <p className="font-medium">
                  {transaction.type === "deposit" && "إيداع"}
                  {transaction.type === "withdrawal" && "سحب"}
                  {transaction.type === "investment" && "استثمار"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.created_at).toLocaleDateString()} -{" "}
                  {new Date(transaction.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                {transaction.type === "deposit" ? "+" : "-"}
                {transaction.amount.toLocaleString()} دج
              </p>
              <p className="text-sm">
                {transaction.status === "completed" && <span className="text-green-600">مكتمل</span>}
                {transaction.status === "pending" && <span className="text-yellow-600">قيد التنفيذ</span>}
                {transaction.status === "failed" && <span className="text-red-600">فشل</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }
}


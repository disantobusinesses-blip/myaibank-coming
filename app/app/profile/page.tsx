"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LegalFooter } from "@/components/legal-footer"
import { User, Mail, MapPin, Building2, Shield, Loader2, AlertCircle } from "lucide-react"

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [firstName, setFirstName] = useState(profile?.first_name || "")
  const [lastName, setLastName] = useState(profile?.last_name || "")
  const [region, setRegion] = useState(profile?.region || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isConnectingBank, setIsConnectingBank] = useState(false)
  const [bankConnectError, setBankConnectError] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    await updateProfile({
      first_name: firstName || null,
      last_name: lastName || null,
      region: region || null,
    })
    setIsSaving(false)
  }

  const handleConnectBank = async () => {
    setIsConnectingBank(true)
    setBankConnectError("")
    
    try {
      // Call API to create Fiskil consent session
      const response = await fetch("/api/create-consent-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create consent session")
      }

      const data = await response.json()
      
      // Redirect to Fiskil auth URL for bank consent
      if (data.auth_url) {
        window.location.href = data.auth_url
      } else {
        throw new Error("No auth URL returned")
      }
    } catch (err) {
      console.error("Bank connection error:", err)
      setBankConnectError(err instanceof Error ? err.message : "Failed to connect bank")
      setIsConnectingBank(false)
    }
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      {/* Profile Info */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1F0051] flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">
              {profile?.first_name || profile?.username || "User"}
            </p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="h-12 rounded-xl bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="h-12 rounded-xl bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="h-12 rounded-xl bg-input border-border pl-10 text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-foreground">
              Region
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Australia"
                className="h-12 rounded-xl bg-input border-border pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-12 rounded-xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Bank Connection */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Bank Connection</h2>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-foreground mb-1">
            {profile?.has_bank_connection ? "Connected" : "Not connected"}
          </p>
          <p className="text-xs text-muted-foreground">
            {profile?.has_bank_connection
              ? "Your bank account is linked. You can connect another account anytime."
              : "Link your bank account to see transactions and get AI insights."}
          </p>
        </div>

        {bankConnectError && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{bankConnectError}</p>
          </div>
        )}

        <Button
          onClick={handleConnectBank}
          disabled={isConnectingBank}
          className="w-full h-12 rounded-xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold"
        >
          {isConnectingBank ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            "Connect Bank Account"
          )}
        </Button>
      </div>

      {/* Security */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Security</h2>
        </div>
        
        <Button
          variant="outline"
          onClick={signOut}
          className="w-full h-12 rounded-xl border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
        >
          Sign Out
        </Button>
      </div>

      <LegalFooter />
    </div>
  )
}

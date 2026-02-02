-- MyAiBank Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  region TEXT DEFAULT 'AU',
  is_onboarded BOOLEAN DEFAULT FALSE,
  has_bank_connection BOOLEAN DEFAULT FALSE,
  fiskil_user_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_plan TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank accounts table (from Fiskil)
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fiskil_account_id TEXT NOT NULL,
  account_name TEXT,
  account_type TEXT,
  institution_name TEXT,
  institution_logo TEXT,
  balance DECIMAL(12, 2),
  currency TEXT DEFAULT 'AUD',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fiskil_account_id)
);

-- Transactions table (from Fiskil)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  fiskil_transaction_id TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  description TEXT,
  merchant_name TEXT,
  category TEXT,
  subcategory TEXT,
  transaction_type TEXT, -- 'credit' or 'debit'
  transaction_date DATE NOT NULL,
  is_pending BOOLEAN DEFAULT FALSE,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fiskil_transaction_id)
);

-- Subscriptions table (detected recurring transactions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  amount DECIMAL(12, 2),
  currency TEXT DEFAULT 'AUD',
  frequency TEXT, -- 'weekly', 'monthly', 'yearly'
  next_billing_date DATE,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_transaction_id UUID REFERENCES public.transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget settings table
CREATE TABLE IF NOT EXISTS public.budget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  needs_percent INTEGER DEFAULT 50,
  wants_percent INTEGER DEFAULT 30,
  savings_percent INTEGER DEFAULT 20,
  monthly_income DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio holdings table
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT,
  asset_type TEXT DEFAULT 'stock', -- 'stock', 'etf', 'crypto', 'property'
  quantity DECIMAL(18, 8),
  purchase_price DECIMAL(12, 2),
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync status table (for tracking Fiskil sync progress)
CREATE TABLE IF NOT EXISTS public.sync_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  stage TEXT DEFAULT 'idle', -- 'idle', 'syncing', 'complete', 'error'
  progress INTEGER DEFAULT 0,
  message TEXT,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for bank_accounts
CREATE POLICY "bank_accounts_select_own" ON public.bank_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bank_accounts_insert_own" ON public.bank_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bank_accounts_update_own" ON public.bank_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bank_accounts_delete_own" ON public.bank_accounts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_update_own" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "transactions_delete_own" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_delete_own" ON public.subscriptions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for budget_settings
CREATE POLICY "budget_settings_select_own" ON public.budget_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "budget_settings_insert_own" ON public.budget_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "budget_settings_update_own" ON public.budget_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "budget_settings_delete_own" ON public.budget_settings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for portfolio_holdings
CREATE POLICY "portfolio_holdings_select_own" ON public.portfolio_holdings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "portfolio_holdings_insert_own" ON public.portfolio_holdings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "portfolio_holdings_update_own" ON public.portfolio_holdings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "portfolio_holdings_delete_own" ON public.portfolio_holdings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for sync_status
CREATE POLICY "sync_status_select_own" ON public.sync_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sync_status_insert_own" ON public.sync_status FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sync_status_update_own" ON public.sync_status FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sync_status_delete_own" ON public.sync_status FOR DELETE USING (auth.uid() = user_id);

-- Trigger function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_user_id ON public.portfolio_holdings(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budget_settings_updated_at BEFORE UPDATE ON public.budget_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_holdings_updated_at BEFORE UPDATE ON public.portfolio_holdings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sync_status_updated_at BEFORE UPDATE ON public.sync_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: Add missing UNIQUE constraints for upsert operations
-- Run this in your Supabase SQL Editor BEFORE using the inject endpoint
--
-- Problem: The code uses ON CONFLICT (user_id, fiskil_account_id) and
-- ON CONFLICT (user_id, fiskil_transaction_id), but these UNIQUE constraints
-- may not exist on the live database, causing Postgres error 42P10.
--
-- This script safely:
-- 1) Removes duplicate rows (keeping the most recent)
-- 2) Adds the UNIQUE constraints if they don't already exist

-- ============================================================
-- Step 1: Deduplicate bank_accounts
-- Keep the row with the latest updated_at for each (user_id, fiskil_account_id)
-- ============================================================
DELETE FROM public.bank_accounts
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY user_id, fiskil_account_id
             ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
           ) AS rn
    FROM public.bank_accounts
    WHERE fiskil_account_id IS NOT NULL
  ) sub
  WHERE rn > 1
);

-- ============================================================
-- Step 2: Deduplicate transactions
-- Keep the row with the latest updated_at for each (user_id, fiskil_transaction_id)
-- ============================================================
DELETE FROM public.transactions
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY user_id, fiskil_transaction_id
             ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
           ) AS rn
    FROM public.transactions
    WHERE fiskil_transaction_id IS NOT NULL
  ) sub
  WHERE rn > 1
);

-- ============================================================
-- Step 3: Add UNIQUE constraint on bank_accounts if missing
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.bank_accounts'::regclass
      AND contype = 'u'
      AND conkey @> ARRAY[
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.bank_accounts'::regclass AND attname = 'user_id'),
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.bank_accounts'::regclass AND attname = 'fiskil_account_id')
      ]
  ) THEN
    ALTER TABLE public.bank_accounts
      ADD CONSTRAINT bank_accounts_user_id_fiskil_account_id_key
      UNIQUE (user_id, fiskil_account_id);
    RAISE NOTICE 'Added UNIQUE constraint on bank_accounts(user_id, fiskil_account_id)';
  ELSE
    RAISE NOTICE 'UNIQUE constraint on bank_accounts(user_id, fiskil_account_id) already exists';
  END IF;
END $$;

-- ============================================================
-- Step 4: Add UNIQUE constraint on transactions if missing
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.transactions'::regclass
      AND contype = 'u'
      AND conkey @> ARRAY[
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.transactions'::regclass AND attname = 'user_id'),
        (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.transactions'::regclass AND attname = 'fiskil_transaction_id')
      ]
  ) THEN
    ALTER TABLE public.transactions
      ADD CONSTRAINT transactions_user_id_fiskil_transaction_id_key
      UNIQUE (user_id, fiskil_transaction_id);
    RAISE NOTICE 'Added UNIQUE constraint on transactions(user_id, fiskil_transaction_id)';
  ELSE
    RAISE NOTICE 'UNIQUE constraint on transactions(user_id, fiskil_transaction_id) already exists';
  END IF;
END $$;

-- Initial schema setup
-- This file contains the basic Supabase extensions

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

-- We'll add our custom tables in the next migration

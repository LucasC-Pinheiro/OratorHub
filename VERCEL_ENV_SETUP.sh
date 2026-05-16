#!/bin/bash
# Vercel Environment Variables Setup
# Run this script to configure Vercel with the correct environment variables
# or manually add these to your Vercel project settings

# SUPABASE Configuration
VITE_SUPABASE_URL=https://drnknluovsjujsrmbtet.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_q0JM3k4FGDt-eHehrMuAnA_8WiqoCrM

# Instructions:
# 1. Go to https://vercel.com/dashboard
# 2. Select your OratorHub project
# 3. Go to Settings → Environment Variables
# 4. Add the following variables for Production:
#    - Name: VITE_SUPABASE_URL
#      Value: https://drnknluovsjujsrmbtet.supabase.co
#      Environment: Production
#
#    - Name: VITE_SUPABASE_ANON_KEY  
#      Value: sb_publishable_q0JM3k4FGDt-eHehrMuAnA_8WiqoCrM
#      Environment: Production
#
# 5. Trigger a new deployment
# 6. Test the application on your Vercel domain

echo "✓ Environment variables configuration guide created"
echo "✓ See inline comments for Vercel setup instructions"

/**
 * Supabase Setup Verification Script
 *
 * This script checks if your Supabase configuration is correct
 * Run: npx tsx scripts/verify-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const EXPECTED_TABLES = ['profiles', 'books', 'voices', 'reading_progress', 'bookmarks'];
const EXPECTED_BUCKETS = ['books', 'voice-samples'];

async function verify() {
  console.log('🔍 Verifying Supabase Setup...\n');

  // Check environment variables
  console.log('1️⃣  Checking environment variables...');
  const missingVars = REQUIRED_ENV_VARS.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:');
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error('\n💡 Copy .env.local.example to .env.local and fill in your values\n');
    process.exit(1);
  }

  console.log('✅ All environment variables present\n');

  // Create Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check database connection
  console.log('2️⃣  Testing database connection...');
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist"
      throw error;
    }
    console.log('✅ Database connection successful\n');
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY\n');
    process.exit(1);
  }

  // Check tables
  console.log('3️⃣  Checking database tables...');
  const missingTables: string[] = [];

  for (const table of EXPECTED_TABLES) {
    const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        missingTables.push(table);
      } else {
        console.warn(`⚠️  Error checking table ${table}:`, error.message);
      }
    } else {
      console.log(`   ✅ ${table}`);
    }
  }

  if (missingTables.length > 0) {
    console.error('\n❌ Missing tables:');
    missingTables.forEach((table) => console.error(`   - ${table}`));
    console.error('\n💡 Run the migration SQL in Supabase SQL Editor:');
    console.error('   supabase/migrations/001_initial_schema.sql\n');
    process.exit(1);
  }

  console.log();

  // Check storage buckets
  console.log('4️⃣  Checking storage buckets...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      throw error;
    }

    const bucketNames = buckets?.map((b) => b.name) || [];
    const missingBuckets = EXPECTED_BUCKETS.filter((name) => !bucketNames.includes(name));

    if (missingBuckets.length > 0) {
      console.error('❌ Missing storage buckets:');
      missingBuckets.forEach((bucket) => console.error(`   - ${bucket}`));
      console.error('\n💡 Create these buckets in Supabase Dashboard > Storage\n');
      process.exit(1);
    }

    EXPECTED_BUCKETS.forEach((bucket) => {
      console.log(`   ✅ ${bucket}`);
    });
    console.log();
  } catch (error: any) {
    console.error('❌ Storage check failed:', error.message);
    console.error('💡 Verify storage is enabled in your Supabase project\n');
    process.exit(1);
  }

  // Check RLS policies
  console.log('5️⃣  Checking Row Level Security...');
  try {
    // Try to query with anon key (should work with RLS)
    const anonClient = createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // This should not fail, even with no results
    const { error } = await anonClient.from('profiles').select('*').limit(1);

    if (error && !error.message.includes('JWT')) {
      console.warn('⚠️  RLS policies might not be configured correctly');
      console.warn('   Error:', error.message);
    } else {
      console.log('✅ RLS policies appear to be working\n');
    }
  } catch (error: any) {
    console.warn('⚠️  Could not verify RLS policies:', error.message);
  }

  // Success!
  console.log('🎉 Supabase setup verification complete!\n');
  console.log('✨ Your configuration looks good. You can now:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Sign up for an account');
  console.log('   3. Upload a PDF book');
  console.log('   4. Clone a voice and start reading!\n');
}

// Run verification
verify().catch((error) => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});

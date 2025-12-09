
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enofuemybbmueeqndhdn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVub2Z1ZW15YmJtdWVlcW5kaGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTYyMjksImV4cCI6MjA4MDc3MjIyOX0.fVWuJBQoLHL5TgVn8gl3YV68xJzU0ZnFtZg0RfxaB9M'

export const supabase = createClient(supabaseUrl, supabaseKey)

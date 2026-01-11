import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const { name, price } = await request.json()

  if (!name || !price) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price: parseFloat(price) }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
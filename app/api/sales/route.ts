import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const { productId, quantity } = await request.json()

  if (!productId || !quantity) {
    return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('sales')
    .insert([{ product_id: productId, quantity: parseInt(quantity) }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
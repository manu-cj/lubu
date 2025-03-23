import { NextResponse } from 'next/server';
import db from './../../../lib/db';
import { Category } from './../../../types/category';


export async function GET() {
  const revenueCategories = db.prepare('SELECT * FROM revenue_categories').all() as Category[];

  return NextResponse.json(revenueCategories);
}

import { NextResponse } from 'next/server';
import db from './../../../lib/db';
import { Category } from './../../../types/category';


export async function GET() {
  const expenseCategories = db.prepare('SELECT * FROM expense_categories').all() as Category[];

  return NextResponse.json(expenseCategories);
}

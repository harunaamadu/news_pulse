// src/lib/data/site.ts
'use cache'

import { cacheLife } from "next/cache"; 

export async function getCurrentYear() {
  cacheLife('max')
  return new Date().getFullYear()
}

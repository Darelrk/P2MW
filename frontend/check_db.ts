import { config } from 'dotenv'
config({ path: '.env.local' })
import { db } from './src/db/index.js'
import { products, builderOptions } from './src/db/schema.js'

async function check() {
    const res = await db.select({ id: products.id, name: products.name, imageUrl: products.imageUrl, modelUrl: products.modelUrl }).from(products)
    console.log("PRODUCTS:")
    console.table(res)

    const opts = await db.select({ id: builderOptions.id, name: builderOptions.name, imageUrl: builderOptions.imageUrl }).from(builderOptions)
    console.log("BUILDER OPTIONS:")
    console.table(opts)
}
check().catch(console.error)

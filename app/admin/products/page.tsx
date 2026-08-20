import Image from 'next/image'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import prisma from '@/lib/prisma'
import DeleteButton from './DeleteButton'
import { Prisma } from '@prisma/client'

type ProductRow = {
  id: string
  name: string
  slug: string
  brand: string | null
  price: Prisma.Decimal
  stock: number
  isActive: boolean
  imageUrl: string | null
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  let products: ProductRow[] = []
  
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error("Database connection error:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">المنتجات</h2>
        <Link 
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الصورة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المنتج
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الماركة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المخزون
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    لا توجد منتجات حتى الآن أو أن قاعدة البيانات غير متصلة.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">بدون</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.brand || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'فعال' : 'غير فعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton id={product.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {products.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            لا توجد منتجات حتى الآن أو أن قاعدة البيانات غير متصلة.
          </div>
        ) : (
          products.map((product) => (
            <article key={product.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">بدون</div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-gray-900">{product.name}</h3>
                  <p className="mt-1 truncate text-xs text-gray-500">{product.brand || 'بدون ماركة'}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="font-bold text-gray-900">{Number(product.price).toFixed(2)} ر.ي</span>
                    <span>المخزون: {product.stock}</span>
                    <span className={`rounded-full px-2 py-1 font-semibold ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isActive ? 'فعال' : 'غير فعال'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                <Link href={`/admin/products/${product.id}/edit`} className="btn btn-outline min-h-11 flex-1 gap-2 text-sm">
                  <Edit className="h-4 w-4" /> تعديل
                </Link>
                <div className="flex min-h-11 items-center">
                  <DeleteButton id={product.id} />
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

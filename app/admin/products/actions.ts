// app/admin/products/actions.ts

'use server';

import prisma from '@/lib/prisma';
import { putTrackedBlob } from '@/lib/usage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { verifyAdmin } from '@/lib/auth';

const MAX_ADDITIONAL_IMAGES = 2;

function parseStringArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function createSlugCandidate(value: string | null, name: string): string {
  const source = (value?.trim() || name.trim()).toLowerCase();
  const slug = source
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || `product-${Date.now()}`;
}

async function getUniqueProductSlug(candidate: string, excludeId?: string): Promise<string> {
  let slug = candidate;
  let attempt = 0;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    attempt += 1;
    slug = `${candidate}-${Date.now()}-${attempt}`;
  }
}

async function prepareImages(imageUrl: string | null, extraImages: string[]) {
  const storedExtraImages: string[] = [];
  const cleanImageUrl = imageUrl?.trim() || null;
  const needsBlobUpload = Boolean(
    (cleanImageUrl && !cleanImageUrl.startsWith('https://')) ||
      extraImages.some((img) => img && !img.startsWith('https://'))
  );
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (needsBlobUpload && !blobToken) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  let storedImageUrl = cleanImageUrl;
  if (cleanImageUrl && !cleanImageUrl.startsWith('https://')) {
    const response = await fetch(cleanImageUrl);
    if (!response.ok) throw new Error('تعذر قراءة الصورة الرئيسية');
    const file = await response.blob();
    const filename = `products/${Date.now()}-main-${Math.random().toString(36).slice(2)}.webp`;
    const { url } = await putTrackedBlob(
      filename,
      file,
      { access: 'public', token: blobToken! },
      'product',
      file.size
    );
    storedImageUrl = url;
  }

  for (const img of extraImages) {
    if (!img || typeof img !== 'string') continue;
    if (img.startsWith('https://')) {
      storedExtraImages.push(img);
      continue;
    }

    const response = await fetch(img);
    if (!response.ok) throw new Error('تعذر قراءة إحدى الصور الإضافية');
    const file = await response.blob();
    const filename = `products/${Date.now()}-extra-${Math.random().toString(36).slice(2)}.webp`;
    const { url } = await putTrackedBlob(
      filename,
      file,
      { access: 'public', token: blobToken! },
      'product',
      file.size
    );
    storedExtraImages.push(url);
  }

  return { storedImageUrl, storedExtraImages };
}

function readProductFields(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const rawSlug = typeof formData.get('slug') === 'string' ? String(formData.get('slug')) : null;
  const price = Number(formData.get('price'));
  const stockValue = formData.get('stock');
  const stock = stockValue === null || stockValue === '' ? 0 : Number(stockValue);

  if (!name || !Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
    throw new Error('بيانات المنتج الأساسية غير صالحة');
  }

  return {
    name,
    rawSlug,
    brand: (formData.get('brand') as string | null) || null,
    collectionId: (formData.get('collectionId') as string | null) || null,
    gender: (formData.get('gender') as string | null) || null,
    size: (formData.get('size') as string | null) || null,
    description: (formData.get('description') as string | null) || null,
    price,
    compareAtPrice: formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : null,
    sku: (formData.get('sku') as string | null) || null,
    stock,
    isActive: formData.has('isActive') ? formData.get('isActive') === 'on' : true,
    featured: formData.get('featured') === 'on',
    bestseller: formData.get('bestseller') === 'on',
    imageUrl: (formData.get('imageUrl') as string | null) || null,
    extraImages: parseStringArray(formData.get('images')).slice(0, MAX_ADDITIONAL_IMAGES),
    seoSearchPhrases: parseStringArray(formData.get('seoSearchPhrases')),
    seoScore: formData.get('seoScore') ? Number(formData.get('seoScore')) : null,
  };
}

/** Server Action to create a new product. */
export async function createProduct(formData: FormData) {
  await verifyAdmin();
  const fields = readProductFields(formData);
  const slug = await getUniqueProductSlug(createSlugCandidate(fields.rawSlug, fields.name));
  const { storedImageUrl, storedExtraImages } = await prepareImages(fields.imageUrl, fields.extraImages);

  const product = await prisma.product.create({
    data: {
      name: fields.name,
      slug,
      brand: fields.brand ?? undefined,
      collectionId: fields.collectionId || undefined,
      gender: fields.gender || undefined,
      size: fields.size || undefined,
      description: fields.description ?? undefined,
      price: fields.price,
      compareAtPrice: fields.compareAtPrice ?? undefined,
      sku: fields.sku ?? undefined,
      stock: fields.stock,
      isActive: fields.isActive,
      featured: fields.featured,
      bestseller: fields.bestseller,
      imageUrl: storedImageUrl ?? undefined,
      images: storedExtraImages,
      seoSearchPhrases: fields.seoSearchPhrases,
      seoScore: fields.seoScore,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/products/${product.slug}`);
  redirect('/admin/products');
}

/** Server Action to delete a product. */
export async function deleteProduct(productId: string) {
  await verifyAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath('/admin/products');
  return { success: true };
}

/** Server Action to update a product. */
export async function updateProduct(formData: FormData) {
  await verifyAdmin();
  const id = String(formData.get('id') || '');
  if (!id) throw new Error('معرّف المنتج مفقود');

  const fields = readProductFields(formData);
  const slug = await getUniqueProductSlug(createSlugCandidate(fields.rawSlug, fields.name), id);
  const { storedImageUrl, storedExtraImages } = await prepareImages(fields.imageUrl, fields.extraImages);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: fields.name,
      slug,
      brand: fields.brand ?? undefined,
      collectionId: fields.collectionId || undefined,
      gender: fields.gender || undefined,
      size: fields.size || undefined,
      description: fields.description ?? undefined,
      price: fields.price,
      compareAtPrice: fields.compareAtPrice ?? undefined,
      sku: fields.sku ?? undefined,
      stock: fields.stock,
      isActive: fields.isActive,
      featured: fields.featured,
      bestseller: fields.bestseller,
      imageUrl: storedImageUrl ?? undefined,
      images: storedExtraImages,
      seoSearchPhrases: fields.seoSearchPhrases,
      seoScore: fields.seoScore,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/products/${product.slug}`);
  redirect('/admin/products');
}

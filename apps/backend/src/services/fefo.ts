import { queryWithTenant } from '../db';
import { InventoryBatch } from '@7days/shared-types';

export interface FEFOAllocationResult {
  success: boolean;
  product_id: string;
  requested_qty: number;
  allocated_qty: number;
  allocations: Array<{
    batch_id: string;
    batch_number: string;
    expiry_date: string;
    quantity: number;
  }>;
  shortage?: number;
}

/**
 * خوارزمية السحب الذكي بنظام الأقرب انتهاءً أولاً (First-Expired, First-Out - FEFO)
 * المرجع: docs/04_API_And_Business_Rules_Matrix.md (القسم 3)
 */
export async function allocateFEFOBatches(
  tenantId: string,
  productId: string,
  requestedQty: number
): Promise<FEFOAllocationResult> {
  const today = new Date().toISOString().split('T')[0];

  // جلب التشغيلات المتاحة مرتبة تصاعدياً بتاريخ الصلاحية الأقرب
  const batches = await queryWithTenant<InventoryBatch>(
    tenantId,
    `SELECT * FROM inventory_batches
     WHERE tenant_id = $1 
       AND product_id = $2 
       AND expiry_date > $3 
       AND quantity_available > 0
     ORDER BY expiry_date ASC`,
    [tenantId, productId, today]
  );

  let totalAllocated = 0;
  const allocations: FEFOAllocationResult['allocations'] = [];

  for (const batch of batches) {
    const needed = requestedQty - totalAllocated;
    if (needed <= 0) break;

    const allocQty = Math.min(batch.quantity_available, needed);
    if (allocQty > 0) {
      allocations.push({
        batch_id: batch.id,
        batch_number: batch.batch_number,
        expiry_date: batch.expiry_date,
        quantity: allocQty,
      });
      totalAllocated += allocQty;
    }
  }

  if (totalAllocated < requestedQty) {
    return {
      success: false,
      product_id: productId,
      requested_qty: requestedQty,
      allocated_qty: totalAllocated,
      shortage: requestedQty - totalAllocated,
      allocations,
    };
  }

  return {
    success: true,
    product_id: productId,
    requested_qty: requestedQty,
    allocated_qty: totalAllocated,
    allocations,
  };
}

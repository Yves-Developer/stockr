# Inventory Management — Database Plan

## Overview

This document outlines the proposed database schema for the Inventory Management module. No code changes are included — this is a planning reference only.

---

## Tables

### 1. `products`
Stores the master catalog of all products/items tracked in inventory.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique product identifier |
| `sku` | VARCHAR(100) | UNIQUE, NOT NULL | Stock Keeping Unit code |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `description` | TEXT | | Product description |
| `category_id` | UUID | FK → categories.id | Product category |
| `unit_of_measure` | VARCHAR(50) | NOT NULL | e.g. "kg", "pcs", "litre" |
| `reorder_point` | INTEGER | NOT NULL, DEFAULT 0 | Minimum stock level before reorder alert |
| `reorder_quantity` | INTEGER | NOT NULL, DEFAULT 0 | Suggested quantity to reorder |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Soft-delete flag |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Record creation time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | Last update time |

---

### 2. `categories`
Groups products into logical categories.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique category identifier |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| `parent_id` | UUID | FK → categories.id, NULLABLE | For nested/subcategory support |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

---

### 3. `warehouses`
Represents physical storage locations (warehouses, stores, rooms, etc.).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique warehouse identifier |
| `name` | VARCHAR(150) | NOT NULL | Warehouse/location name |
| `address` | TEXT | | Physical address |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

---

### 4. `inventory_stock`
Tracks the current quantity of each product at each warehouse. This is the core stock ledger.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `product_id` | UUID | FK → products.id, NOT NULL | |
| `warehouse_id` | UUID | FK → warehouses.id, NOT NULL | |
| `quantity_on_hand` | DECIMAL(12,3) | NOT NULL, DEFAULT 0 | Current available stock |
| `quantity_reserved` | DECIMAL(12,3) | NOT NULL, DEFAULT 0 | Quantity allocated to pending orders |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

**Unique constraint:** `(product_id, warehouse_id)` — one row per product per location.

**Derived value:** `quantity_available = quantity_on_hand - quantity_reserved`

---

### 5. `stock_movements`
Immutable audit log of every stock change (receipts, shipments, adjustments, transfers).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `product_id` | UUID | FK → products.id, NOT NULL | |
| `warehouse_id` | UUID | FK → warehouses.id, NOT NULL | |
| `movement_type` | ENUM | NOT NULL | See Movement Types below |
| `quantity` | DECIMAL(12,3) | NOT NULL | Positive = stock in, Negative = stock out |
| `reference_type` | VARCHAR(50) | | e.g. "purchase_order", "sales_order", "adjustment" |
| `reference_id` | UUID | | ID of the related record |
| `notes` | TEXT | | Free-text reason/notes |
| `performed_by` | UUID | FK → users.id | User who triggered the movement |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

**Movement Types (ENUM values):**
- `RECEIPT` — stock received from supplier
- `SHIPMENT` — stock sent to customer
- `TRANSFER_IN` — received from another warehouse
- `TRANSFER_OUT` — sent to another warehouse
- `ADJUSTMENT_POSITIVE` — manual increase (e.g. count correction)
- `ADJUSTMENT_NEGATIVE` — manual decrease (e.g. damage/loss)
- `RETURN_IN` — customer return received back
- `RETURN_OUT` — stock returned to supplier

---

### 6. `suppliers`
Stores supplier/vendor information.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `name` | VARCHAR(255) | NOT NULL | Supplier name |
| `contact_name` | VARCHAR(150) | | Primary contact person |
| `email` | VARCHAR(255) | | |
| `phone` | VARCHAR(50) | | |
| `address` | TEXT | | |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

---

### 7. `purchase_orders`
Tracks orders placed with suppliers to replenish stock.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `supplier_id` | UUID | FK → suppliers.id, NOT NULL | |
| `warehouse_id` | UUID | FK → warehouses.id, NOT NULL | Destination warehouse |
| `status` | ENUM | NOT NULL | `DRAFT`, `SUBMITTED`, `PARTIAL`, `RECEIVED`, `CANCELLED` |
| `expected_date` | DATE | | Expected delivery date |
| `notes` | TEXT | | |
| `created_by` | UUID | FK → users.id | |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

---

### 8. `purchase_order_items`
Line items on each purchase order.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | |
| `purchase_order_id` | UUID | FK → purchase_orders.id, NOT NULL | |
| `product_id` | UUID | FK → products.id, NOT NULL | |
| `quantity_ordered` | DECIMAL(12,3) | NOT NULL | |
| `quantity_received` | DECIMAL(12,3) | NOT NULL, DEFAULT 0 | |
| `unit_cost` | DECIMAL(12,2) | | Cost per unit at time of order |

---

## Relationships Summary

```
categories (self-referencing for subcategories)
    └── products
            ├── inventory_stock ←→ warehouses
            ├── stock_movements ←→ warehouses
            └── purchase_order_items
                        └── purchase_orders → suppliers → warehouses
```

---

## Indexes (Recommended)

| Table | Index Columns | Reason |
|---|---|---|
| `products` | `sku` | Fast SKU lookup |
| `products` | `category_id` | Filter by category |
| `inventory_stock` | `(product_id, warehouse_id)` | Core stock lookup |
| `inventory_stock` | `product_id` | Aggregate stock across locations |
| `stock_movements` | `product_id, created_at` | Movement history per product |
| `stock_movements` | `warehouse_id, created_at` | Movement history per warehouse |
| `stock_movements` | `(reference_type, reference_id)` | Link back to source records |
| `purchase_orders` | `supplier_id` | Orders per supplier |
| `purchase_orders` | `status` | Filter by order status |

---

## Notes & Decisions to Confirm

- **UUID vs. auto-increment IDs** — UUIDs used throughout for portability; switch to BIGSERIAL if sequential IDs are preferred for performance.
- **Multi-warehouse support** — the schema supports multiple locations via `inventory_stock`. If single-warehouse only, `warehouse_id` can default to a single record.
- **Soft deletes** — `products`, `warehouses`, `suppliers` use `is_active` instead of hard deletes to preserve historical data integrity.
- **Currency** — no currency table included yet. If multi-currency support is needed, add a `currencies` table and link to `unit_cost`.
- **Users table** — `performed_by` / `created_by` columns reference a `users` table assumed to exist in the existing auth system.
- **Stock valuation method** — FIFO/LIFO/AVCO not yet modeled. If cost tracking is needed, `stock_movements` can be extended with a `unit_cost` column.
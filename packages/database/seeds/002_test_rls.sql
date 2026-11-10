-- Test Multi-Tenant RLS
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tenant_app_user') THEN
    CREATE ROLE tenant_app_user WITH LOGIN PASSWORD 'secret';
  END IF;
END
$$;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tenant_app_user;

-- Test 1: Query without setting tenant (Expect 0 rows due to RLS)
SET ROLE tenant_app_user;
RESET app.current_tenant_id;
SELECT count(*) AS count_without_tenant FROM customers;

-- Test 2: Set tenant to El Amal (Expect 1 row: صالون نور الحياة)
SET app.current_tenant_id = '11111111-1111-1111-1111-111111111111';
SELECT name AS customer_for_elamal FROM customers;

-- Test 3: Set tenant to Royal Care (Expect 0 rows because salon belongs to El Amal)
SET app.current_tenant_id = '22222222-2222-2222-2222-222222222222';
SELECT count(*) AS count_for_royalcare FROM customers;

RESET ROLE;

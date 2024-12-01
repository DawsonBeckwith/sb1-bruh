-- Create stripe_customers table
create table stripe_customers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  customer_id text unique,
  email text not null,
  name text,
  product_id text,
  subscription_status text,
  subscription_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table stripe_customers enable row level security;

-- Create policies
create policy "Users can view their own customer data"
  on stripe_customers for select
  using (auth.uid() = user_id);

create policy "Service role can manage all customer data"
  on stripe_customers for all
  using (auth.role() = 'service_role');

-- Create indexes
create index stripe_customers_user_id_idx on stripe_customers(user_id);
create index stripe_customers_customer_id_idx on stripe_customers(customer_id);
create index stripe_customers_subscription_id_idx on stripe_customers(subscription_id);

-- Set up triggers for updated_at
create trigger stripe_customers_updated_at
  before update on stripe_customers
  for each row
  execute procedure handle_updated_at();
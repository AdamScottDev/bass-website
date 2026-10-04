-- BASS: paste all of this into Supabase > SQL Editor > New query > Run.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'New member',
  pronouns text, bio text, status_line text,
  approved boolean not null default false,   -- change default to true to stop needing approval
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create function public.is_admin() returns boolean language sql security definer stable set search_path = public
as $$ select coalesce((select is_admin from public.profiles where id = auth.uid()), false) $$;
create function public.is_member() returns boolean language sql security definer stable set search_path = public
as $$ select coalesce((select approved from public.profiles where id = auth.uid()), false) $$;

create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "admins read all" on public.profiles for select to authenticated using (public.is_admin());
create policy "members read approved members" on public.profiles for select to authenticated using (approved and public.is_member());
create policy "edit own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Members can only change these four fields. They can never approve themselves.
revoke update on public.profiles from anon, authenticated;
grant update (display_name, pronouns, bio, status_line) on public.profiles to authenticated;

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles (id) values (new.id); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Admin-only: list members with their emails (emails are never stored in the public profile).
create function public.admin_members() returns table (id uuid, email text, display_name text, approved boolean, created_at timestamptz)
language plpgsql security definer set search_path = public
as $$ begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  return query select p.id, u.email::text, p.display_name, p.approved, p.created_at
    from public.profiles p join auth.users u on u.id = p.id order by p.created_at desc;
end $$;
create function public.set_approval(target uuid, ok boolean) returns void language plpgsql security definer set search_path = public
as $$ begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update public.profiles set approved = ok where id = target;
end $$;
revoke execute on function public.admin_members(), public.set_approval(uuid, boolean) from anon;

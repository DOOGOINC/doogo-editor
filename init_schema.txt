-- 1. 프로필 테이블
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text unique,
  points integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. 프로젝트 테이블
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  content jsonb not null,
  main_color text,
  font_family text,
  title_font_family text,
  body_font_family text,
  font_size_step integer default 1,
  thumbnail text,
  is_purchased boolean default false,
  is_deleted boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. 이미지 라이브러리 테이블
create table if not exists user_images (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  storage_path text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS 설정
alter table profiles enable row level security;
alter table projects enable row level security;
alter table user_images enable row level security;

-- 정책 재설정 (삭제 후 생성)
drop policy if exists "Anyone can view profiles for nickname check" on profiles;
create policy "Anyone can view profiles for nickname check" on profiles for select using (true);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Users can manage own projects" on projects;
create policy "Users can manage own projects" on projects for all using (auth.uid() = user_id);

drop policy if exists "Users can manage own images" on user_images;
create policy "Users can manage own images" on user_images for all using (auth.uid() = user_id);

-- 💡 4. Storage 설정 (버킷 생성 및 정책)
-- 주의: 이 부분은 Supabase Dashboard의 Storage 메뉴에서 직접 'user-images' 버킷을 'Public'으로 생성하는 것을 권장합니다.
-- 아래는 SQL로 생성하는 시도입니다.
insert into storage.buckets (id, name, public)
values ('user-images', 'user-images', true)
on conflict (id) do nothing;

-- Storage RLS 정책 (로그인한 유저만 자신의 폴더에 업로드 가능)
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'user-images' );

drop policy if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images" on storage.objects 
  for insert with check ( bucket_id = 'user-images' and auth.role() = 'authenticated' );

drop policy if exists "Users can delete own images" on storage.objects;
create policy "Users can delete own images" on storage.objects 
  for delete using ( bucket_id = 'user-images' and auth.uid()::text = (storage.foldername(name))[1] );

-- 트리거 함수
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, points)
  values (new.id, new.raw_user_meta_data->>'nickname', 0);
  return new;
end;
$$ language plpgsql security definer;

-- 트리거 설정
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
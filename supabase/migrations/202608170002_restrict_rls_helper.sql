-- Supabase連携が作成したイベントトリガー用関数は、DDLイベントからだけ実行します。
-- Data APIのRPCとして匿名・一般ユーザー・アプリサーバーから直接呼び出す必要はありません。
revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role;

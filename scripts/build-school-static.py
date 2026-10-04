"""Generate an isolated school export; never modify the source application."""
from pathlib import Path
import shutil, subprocess, tempfile, os
root = Path(__file__).resolve().parents[1]
work = Path(tempfile.mkdtemp(prefix='care-hair-school-')) / 'source'
shutil.copytree(root, work, ignore=shutil.ignore_patterns('.git', 'node_modules', '.next', 'out', '.env', '.env.*', '*.tsbuildinfo'))
for folder in ('app/api', 'app/admin'):
    shutil.rmtree(work / folder)
(work / 'middleware.ts').unlink(missing_ok=True)
(work / 'next.config.mjs').write_text('export default { output: "export", images: { unoptimized: true } };\n')
p = work / 'app/mypage/page.tsx'
s = p.read_text(); start = s.index('        <section className="mt-12'); end = s.index('        </section>', start)+len('        </section>')
s = s[:start]+s[end:]
s = s.replace('export const dynamic = "force-dynamic";','').replace('  const admin = await getAdminFromCookies().catch(() => null);','')
s = '\n'.join(line for line in s.splitlines() if not any(x in line for x in ('import Link ', 'import { ShieldCheck', 'import { AdminLoginForm', 'import { getAdminFromCookies')))
p.write_text(s)
p = work / 'features/reviews/product-review-form.tsx'
p.write_text('export function ProductReviewForm({ defaultProductId }: { defaultProductId?: string }) { return <div className="rounded-brand border border-line bg-white p-6 text-sm text-muted">学校公開版では口コミの投稿・共有は利用できません。</div>; }\n')
p = work / 'features/reviews/review-page-content.tsx'
s = p.read_text();start=s.index('    try {\n', s.index('const loadReviews'));end=s.index('  }, []);',start)
s=s[:start]+'    setReviews([]); setLoading(false);\n'+s[end:];p.write_text(s)
p = work / 'app/result/result-content.tsx'
s = p.read_text();start=s.index('    const controller = new AbortController();');end=s.index('  }, [diagnosisId]);',start)
s=s[:start]+'    setError("この端末に診断結果がありません。学校公開版では、同じ端末で診断してください。");\n'+s[end:];p.write_text(s)
for file in ('app/robots.ts','app/sitemap.ts','app/layout.tsx'):
    p=work/file;p.write_text(p.read_text().replace('https://care-hair.vercel.app','https://menshair.kosei-lab.jp'))
env = dict(os.environ, NEXT_TELEMETRY_DISABLED='1')
subprocess.run(['npm','install','--ignore-scripts','--package-lock=false'],cwd=work,env=env,check=True)
subprocess.run(['npm','run','build'],cwd=work,env=env,check=True)
if not (work/'out/index.html').is_file(): raise RuntimeError('index.html was not generated')
print('SCHOOL_EXPORT='+str(work/'out'))

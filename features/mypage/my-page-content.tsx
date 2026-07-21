"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Bell, CalendarDays, History, Megaphone, Trophy } from "lucide-react";
import { Card, CardEyebrow } from "@/components/ui/card";
import { dummyNotificationAdapter, myPageData } from "@/data/mypage";

export function MyPageContent() {
  const [startDate, setStartDate] = useState("");
  const notification = useMemo(
    () => (startDate ? dummyNotificationAdapter.scheduleRediagnosis(startDate) : null),
    [startDate]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <Card as="section" className="lg:sticky lg:top-28">
        <CardEyebrow>My care</CardEyebrow>
        <h2 className="mt-3 text-2xl font-semibold">使用開始日を登録</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          今は端末内のダミー表示です。将来はFirebaseなどの通知基盤へ差し替えられる設計です。
        </p>
        <label className="mt-6 grid gap-2 text-sm font-semibold">
          使用開始日
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
          />
        </label>
        {notification ? (
          <div className="mt-6 rounded-brand bg-secondary p-5">
            <div className="flex items-center gap-3 text-green">
              <Bell className="h-5 w-5" />
              <p className="font-semibold">{notification.title}</p>
            </div>
            <p className="mt-3 text-2xl font-semibold">{notification.date}</p>
            <p className="mt-2 text-sm text-muted">{notification.message}</p>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-6">
        <Panel icon={CalendarDays} title="季節ごとのおすすめ商品">
          {myPageData.seasonalRecommendations.map((item) => (
            <Row key={item.season} label={`${item.season}・${item.title}`} value={item.product} />
          ))}
        </Panel>
        <Panel icon={Megaphone} title="新商品のお知らせ">
          {myPageData.announcements.map((item) => (
            <p key={item} className="rounded-brand bg-soft p-4 text-sm text-muted">{item}</p>
          ))}
        </Panel>
        <Panel icon={History} title="診断履歴">
          {myPageData.diagnosisHistory.map((item) => (
            <Row key={item.date} label={`${item.date} ${item.result}`} value={item.product} />
          ))}
        </Panel>
        <Panel icon={Trophy} title="ランキング・今月人気の商品">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-3 font-semibold text-green">ランキング</p>
              {myPageData.ranking.map((item, index) => (
                <Row key={item} label={`${index + 1}位`} value={item} />
              ))}
            </div>
            <div>
              <p className="mb-3 font-semibold text-green">今月人気</p>
              {myPageData.monthlyPopular.map((item) => (
                <Row key={item} label="人気商品" value={item} />
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: typeof Bell; title: string; children: ReactNode }) {
  return (
    <Card as="section">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-green">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid gap-3">{children}</div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-brand border border-line bg-white p-4 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
      <span className="text-muted">{label}</span>
      <strong className="text-green">{value}</strong>
    </div>
  );
}

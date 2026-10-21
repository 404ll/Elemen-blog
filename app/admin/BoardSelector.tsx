"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function BoardSelector({
  boardIds,
  selected,
}: {
  boardIds: string[];
  selected: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="YouMind Board"
      value={selected}
      disabled={pending}
      onChange={(event) => {
        const boardId = event.target.value;
        startTransition(() => router.push(`/admin?board=${boardId}`));
      }}
    >
      {boardIds.map((boardId) => (
        <option key={boardId} value={boardId}>
          {boardId}
        </option>
      ))}
    </select>
  );
}

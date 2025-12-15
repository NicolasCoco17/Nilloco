'use client'

export default function DataList({ rows }: { rows: any[] }) {
  return (
    <ul className="space-y-2 w-full">
      {rows.map((row) => (
        <li
          key={row.id}
          className="p-4 rounded bg-gray-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
        >
          {JSON.stringify(row)}
        </li>
      ))}
    </ul>
  );
}


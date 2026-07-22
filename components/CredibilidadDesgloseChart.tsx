"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const COLORS = {
  especificidad: "#3d9cfd",
  repeticion_norm: "#5b9fd4",
  centralidad: "#8b9aab",
};

export function CredibilidadDesgloseChart({
  especificidad,
  repeticion_norm,
  centralidad,
}: {
  especificidad: number;
  repeticion_norm: number;
  centralidad: number;
}) {
  const data = [
    { name: "Espec. 45%", key: "especificidad", value: especificidad },
    { name: "Rep. 25%", key: "repeticion_norm", value: repeticion_norm },
    { name: "Cent. 30%", key: "centralidad", value: centralidad },
  ];

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={88}
            tick={{ fill: "#8b9aab", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#141b24",
              border: "1px solid #2a3542",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v) => [`${v}`, "Valor"]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((d) => (
              <Cell
                key={d.key}
                fill={COLORS[d.key as keyof typeof COLORS]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

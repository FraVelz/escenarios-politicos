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
  especificidad: "#3b9eff",
  repeticion_norm: "#9281f7",
  centralidad: "#a1a4a5",
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

  const label = `Desglose de credibilidad: especificidad ${especificidad}, repetición ${repeticion_norm}, centralidad ${centralidad}`;

  return (
    <div
      className="chart-inert h-44 w-full"
      role="img"
      aria-label={label}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
          accessibilityLayer={false}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={88}
            tick={{ fill: "#a1a4a5", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#000000",
              border: "1px solid #292d30",
              borderRadius: 0,
              fontSize: 12,
              color: "#f0f0f0",
            }}
            formatter={(v) => [`${v}`, "Valor"]}
          />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            barSize={14}
            isAnimationActive={false}
          >
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

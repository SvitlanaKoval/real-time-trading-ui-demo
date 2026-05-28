import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  data: {
    price: number;
    time: string;
  }[];
};

export function PriceChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis domain={["auto", "auto"]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
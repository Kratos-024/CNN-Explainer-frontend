import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import { Card } from "./Card";

export const LineChartComponent = ({
  stroke,
  Data,
  title,
  domain,
}: {
  domain: number[] | undefined;
  title: string;
  stroke: string;
  Data: {
    layer: string;
    val: number;
  }[];
}) => {
  return (
    <Card>
      <h1>{title}</h1>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={Data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="layer" tick={{ fontSize: 9, fill: "#94a3b8" }} />
          <YAxis
            tick={{ fontSize: 9, fill: "#94a3b8" }}
            domain={domain ? domain : undefined}
          />
          <Line
            type="monotone"
            dataKey="val"
            stroke={stroke}
            strokeWidth={2.5}
            dot={{ r: 4, fill: stroke }}
            activeDot={{ stroke: "#7c3aed", r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart as RechartsAreaChart,
} from "recharts";
import { Card } from "./Card";

type Props = {
  gradId: string;
  title: string;
  stroke: string;
  distData: {
    bin: string;
    val: number;
  }[];
};

export const AreaChartComponent = ({
  gradId,
  title,
  stroke,
  distData,
}: Props) => {
  return (
    <Card>
      <h2>{title}</h2>

      <ResponsiveContainer width="100%" height={150}>
        <RechartsAreaChart data={distData}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

          <XAxis dataKey="bin" tick={{ fontSize: 9, fill: "#94a3b8" }} />

          <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="val"
            stroke={stroke}
            fill={`url(#${gradId})`}
            strokeWidth={2}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

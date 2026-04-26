import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { Card } from "./Card";

type ClsData = { cls: string; conf: number };
type LayerData = { layer: string; val: number };

type Props = {
  stroke: string;
  title: string;
  classData: ClsData[] | LayerData[];
};

const isClsData = (data: any): data is ClsData[] => {
  return data?.[0]?.cls !== undefined;
};

export const BarChartComponent = ({ stroke, classData, title }: Props) => {
  const isCls = isClsData(classData);

  const xKey = isCls ? "cls" : "layer";
  const yKey = isCls ? "conf" : "val";

  return (
    <Card>
      <h2>{title}</h2>

      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={classData as any} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

          <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: "#94a3b8" }} />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: "#94a3b8" }}
            unit="%"
          />

          <Bar dataKey={yKey} fill={stroke} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

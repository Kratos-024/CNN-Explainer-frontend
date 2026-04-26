import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

const BarChartExample = ({
  data,
  isAnimationActive,
}: {
  data: { name: string; uv: number }[];
  isAnimationActive: true;
}) => (
  <BarChart
    style={{
      width: "100%",
      maxWidth: "700px",
      maxHeight: "70vh",
      aspectRatio: 1.618,
    }}
    responsive
    data={data}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis width="auto" />
    <Tooltip />
    <Legend />
    <Bar dataKey="pv" fill="#8884d8" isAnimationActive={isAnimationActive} />
    <RechartsDevtools />
  </BarChart>
);

export default BarChartExample;

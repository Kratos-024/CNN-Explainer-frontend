import { Card } from "../components/Card";
import { LineChartComponent } from "../components/LineChartComponent";
import { BarChartComponent } from "../components/BarChartComponent";
import { AreaChartComponent } from "../components/AreaChart";
import { type SidePanelProps } from "../../public/constants/typeData";

export const SidePanel = ({
  mode,
  prediction,
  classConfidence,
  meanData,
  varData,
  sparData,
  distData,
}: SidePanelProps) => {
  const isNo = mode === "no-dropout";
  const stroke = "#82ca9d";
  const gradId = isNo ? "grad-blue" : "grad-orange";

  return (
    <div className="flex flex-col gap-5 min-w-0">
      <Card>
        <h1>Prediction</h1>
        <p className="text-lg font-black text-slate-800 mb-1">{prediction}</p>
      </Card>

      <BarChartComponent
        title="Class Confidence"
        stroke={stroke}
        classData={classConfidence}
      />

      <LineChartComponent
        domain={[0, 1]}
        title="Mean Activation · Layer"
        stroke={stroke}
        Data={meanData}
      />

      <LineChartComponent
        domain={undefined}
        title="Activation Variance · Layer"
        stroke={stroke}
        Data={varData}
      />

      <BarChartComponent
        title="Sparsity · Layer"
        stroke={stroke}
        classData={sparData}
      />

      <AreaChartComponent
        gradId={gradId}
        title="Activation Distribution"
        stroke={stroke}
        distData={distData}
      />
    </div>
  );
};

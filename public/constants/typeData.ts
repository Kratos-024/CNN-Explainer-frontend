type LayerStat = {
  layer: string;
  meanNo: number;
  meanDo: number;
  varNo: number;
  varDo: number;
  sparNo: number;
  sparDo: number;
};

type DropoutResponse = {
  predictionNo: string;
  predictionDo: string;
  classProbNo: { cls: string; conf: number }[];
  classProbDo: { cls: string; conf: number }[];
  layerStats: LayerStat[];
  distNo: { bin: string; val: number }[];
  distDo: { bin: string; val: number }[];
};

const fallbackClassProbNo = [
  { cls: "Buildings", conf: 72 },
  { cls: "Forest", conf: 88 },
  { cls: "Glacier", conf: 55 },
  { cls: "Mountain", conf: 63 },
  { cls: "Sea", conf: 45 },
  { cls: "Street", conf: 81 },
];

const fallbackClassProbDo = [
  { cls: "Buildings", conf: 61 },
  { cls: "Forest", conf: 79 },
  { cls: "Glacier", conf: 48 },
  { cls: "Mountain", conf: 57 },
  { cls: "Sea", conf: 41 },
  { cls: "Street", conf: 74 },
];

const fallbackLayerStats: LayerStat[] = [
  {
    layer: "Conv1",
    meanNo: 0.43,
    meanDo: 0.29,
    varNo: 0.82,
    varDo: 0.54,
    sparNo: 12,
    sparDo: 31,
  },
  {
    layer: "Conv2",
    meanNo: 0.61,
    meanDo: 0.44,
    varNo: 1.14,
    varDo: 0.78,
    sparNo: 18,
    sparDo: 42,
  },
  {
    layer: "Conv3",
    meanNo: 0.74,
    meanDo: 0.53,
    varNo: 1.37,
    varDo: 0.93,
    sparNo: 22,
    sparDo: 51,
  },
  {
    layer: "Conv4",
    meanNo: 0.88,
    meanDo: 0.66,
    varNo: 1.61,
    varDo: 1.12,
    sparNo: 29,
    sparDo: 63,
  },
];

const fallbackDistNo = [
  { bin: "-1.0", val: 4 },
  { bin: "-0.5", val: 9 },
  { bin: "0.0", val: 21 },
  { bin: "0.5", val: 38 },
  { bin: "1.0", val: 52 },
  { bin: "1.5", val: 29 },
  { bin: "2.0", val: 11 },
];

const fallbackDistDo = [
  { bin: "-1.0", val: 7 },
  { bin: "-0.5", val: 14 },
  { bin: "0.0", val: 28 },
  { bin: "0.5", val: 31 },
  { bin: "1.0", val: 39 },
  { bin: "1.5", val: 22 },
  { bin: "2.0", val: 18 },
];

const fallbackData: DropoutResponse = {
  predictionNo: "Forest",
  predictionDo: "Forest",
  classProbNo: fallbackClassProbNo,
  classProbDo: fallbackClassProbDo,
  layerStats: fallbackLayerStats,
  distNo: fallbackDistNo,
  distDo: fallbackDistDo,
};

type SidePanelProps = {
  mode: "no-dropout" | "dropout";
  prediction: string;
  classConfidence: { cls: string; conf: number }[];
  meanData: { layer: string; val: number }[];
  varData: { layer: string; val: number }[];
  sparData: { layer: string; val: number }[];
  distData: { bin: string; val: number }[];
};
export {
  fallbackData,
  fallbackDistNo,
  fallbackLayerStats,
  fallbackClassProbDo,
  fallbackClassProbNo,
};
export type { SidePanelProps, LayerStat, DropoutResponse };

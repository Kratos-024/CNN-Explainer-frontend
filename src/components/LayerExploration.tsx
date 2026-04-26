import { useEffect, useState } from "react";
import FeatureFlowView from "./FeatureFlowView";
import { applyDropout } from "../Apis/Image";
import DropoutFeatureFlowView from "./DropoutFeatureFlowView";

interface LayerExplorationModalProp {
  outputShape: [number, number, number];
  inputShape: [number, number, number];
  setModelpopUpHandler: (
    mode?: string,
    src?: string[],
    dest?: string,
    input_shape?: [number, number, number],
    outputShape?: [number, number, number]
  ) => void;
  mode: string;
  modelPopUp: boolean;
  outputFeatureMap: string;
  inputFeatureMaps: string[];
}

export const LayerExplorationModal = ({
  outputShape,
  inputShape,
  mode,
  setModelpopUpHandler,
  modelPopUp,
  outputFeatureMap,
  inputFeatureMaps,
}: LayerExplorationModalProp) => {
  const [dropoutImages, setdropoutImages] = useState<string[]>([""]);
  useEffect(() => {
    if (mode == "dropout") {
      applyDropoutHandler();
    }
    if (modelPopUp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modelPopUp, inputFeatureMaps, outputFeatureMap]);
  const applyDropoutHandler = async () => {
    const response = await applyDropout(inputFeatureMaps);
    if (response && response.success) {
      setdropoutImages(
        response.images.map((img) => `data:image/png;base64,${img}`)
      );
    }
  };

  return (
    <div>
      {modelPopUp && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full h-full overflow-auto flex items-center justify-center">
            {mode == "dropout" && (
              <DropoutFeatureFlowView
                outputShape={outputShape}
                inputShape={inputShape}
                dropoutImages={dropoutImages}
                setModelpopUpHandler={setModelpopUpHandler}
                inputFeatureMaps={inputFeatureMaps}
              />
            )}
            {mode != "dropout" && (
              <FeatureFlowView
                outputShape={outputShape}
                inputShape={inputShape}
                mode={mode}
                setModelpopUpHandler={setModelpopUpHandler}
                outputFeatureMap={outputFeatureMap}
                inputFeatureMaps={inputFeatureMaps}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

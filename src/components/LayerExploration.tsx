import { useEffect } from "react";
import FeatureFlowView from "./FeatureFlowView";

interface LayerExplorationModalProp {
  setModelpopUpHandler: (mode?: string, src?: string[], dest?: string) => void;
  mode: string;
  modelPopUp: boolean;
  outputFeatureMap: string;
  inputFeatureMaps: string[];
}

export const LayerExplorationModal = ({
  mode,
  setModelpopUpHandler,
  modelPopUp,
  outputFeatureMap,
  inputFeatureMaps,
}: LayerExplorationModalProp) => {
  useEffect(() => {
    if (modelPopUp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modelPopUp, inputFeatureMaps, outputFeatureMap]);
  return (
    <div>
      {modelPopUp && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full h-full overflow-auto flex items-center justify-center">
            <FeatureFlowView
              mode={mode}
              setModelpopUpHandler={setModelpopUpHandler}
              outputFeatureMap={outputFeatureMap}
              inputFeatureMaps={inputFeatureMaps}
            />
          </div>
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import { classifyNdRGB, getimgData } from "./Apis/Image";
import { VisualizationContainer } from "./components/layers";
import { LayerExplorationModal } from "./components/LayerExploration";
import LoadingOverlay from "./components/LoadingComp";
import FloatingModal from "./components/FloatingModel";

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [CnnData, setCnnData] = useState<string[][]>([[]]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const allLayersData: string[][] = [];
  const [animation, setAnimation] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const animationHandler = () => {
    setAnimation(!animation);
  };
  useEffect(() => {
    if (!image) return;

    const sendImage = async () => {
      setLoading(true);
      setLoadingMessage("Reading image data...");
      const reader = new FileReader();

      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(image);

      const formData = new FormData();
      formData.append("Img", image);
      setLoadingMessage(
        "Analyzing RGB Channels & Classifying (first loads take time)"
      );
      const res = await classifyNdRGB(formData);
      if (res) {
        const { softMax_prob, ImageR, ImageG, ImageB } = res;
        allLayersData.push([
          `data:image/png;base64,${ImageR}`,
          `data:image/png;base64,${ImageG}`,
          `data:image/png;base64,${ImageB}`,
        ]);
        allLayersData.push(softMax_prob);
      }
      setLoadingMessage("Getting Convolutional Layers");
      const res2 = await getimgData(formData);
      if (res2?.success) {
        setLoadingMessage("Visualizing Feature Maps");
        const indices = [0, 2, 5, 7, 8, 10, 12, 13, 15, 17, 18];
        indices.forEach((index) => {
          const layerKey = `layer_${index}`;
          if (res2.data[layerKey]) {
            const featImages = res2.data[layerKey].map(
              (img) => `data:image/png;base64,${img}`
            );
            allLayersData.push(featImages);
          }
        });

        setCnnData(allLayersData);
      }

      setLoading(false);
    };

    sendImage();
  }, [image]);
  const [modelpopUp, setModelpopUp] = useState<boolean>(false);
  const [firstLayerImgs, setFirstLayerImgs] = useState<string[]>([]);
  const [nextLayerImg, setNextLayerImg] = useState<string>("");
  const [Mode, setMode] = useState<string>("");
  const [floatingModel, setFloatingModel] = useState<boolean>(true);

  const setModelpopUpHandler = (
    mode?: string,
    firstLayerImgs?: string[],
    nextLayerImage?: string
  ) => {
    setModelpopUp(!modelpopUp);
    if (mode && nextLayerImage && firstLayerImgs) {
      setMode(mode);
      setFirstLayerImgs(firstLayerImgs);
      setNextLayerImg(nextLayerImage);
    }
  };
  return (
    <div className="w-full relative min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">
          CNN & LLM Visualizer
        </h1>
      </nav>

      <div
        className="flex flex-col items-center justify-center
       mt-10 px-4"
      >
        {loading && <LoadingOverlay message={loadingMessage} />}
        <h2
          className="text-2xl font-bold mb-6 text-gray-800 
        text-center"
        >
          Upload Image to Visualize CNN Flow
        </h2>

        <div className="mb-8 flex gap-7">
          <label className="px-6 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-white shadow-sm inline-block">
            <span className="text-gray-700">
              {image ? image.name : "Choose an image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
              className="hidden"
            />
          </label>
          <label className="inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onClick={animationHandler}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              Animation
            </span>
          </label>
        </div>

        {loading && (
          <div className="text-blue-600 font-medium mb-4">
            Processing image...
          </div>
        )}

        {imagePreview && !loading && (
          <VisualizationContainer
            setModelpopUpHandler={(
              mode?: string,
              first?: string[],
              next?: string
            ) => {
              setModelpopUpHandler(mode, first, next);
            }}
            animation={animation}
            featImages={CnnData}
            imagePreview={imagePreview}
          />
        )}

        <LayerExplorationModal
          mode={Mode}
          setModelpopUpHandler={(
            mode?: string,
            first?: string[],
            next?: string
          ) => {
            setModelpopUpHandler(mode, first, next);
          }}
          outputFeatureMap={nextLayerImg}
          inputFeatureMaps={firstLayerImgs}
          modelPopUp={modelpopUp}
        />
      </div>
      {floatingModel && <FloatingModal setFloatingModal={setFloatingModel} />}
    </div>
  );
};
export default App;

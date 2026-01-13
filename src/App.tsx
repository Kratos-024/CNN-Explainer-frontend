import { useEffect, useState, type SetStateAction } from "react";
import { classifyNdRGB, getimgData } from "./Apis/Image";
import { VisualizationContainer } from "./components/layers";
import { ConvolutionMap } from "./components/ConvVisual";

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [featImages, setFeatImages] = useState<string[][]>([[""]]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const allLayersData: SetStateAction<string[][]> = [];

  const [animation, setAnimation] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const animationHandler = () => {
    setAnimation(!animation);
  };
  useEffect(() => {
    if (!image) return;

    const sendImage = async () => {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(image);

      const formData = new FormData();
      formData.append("Img", image);
      const res = await classifyNdRGB(formData);
      if (res) {
        const { predicted_class, ImageR, ImageG, ImageB } = res;
        allLayersData.push([
          `data:image/png;base64,${ImageR}`,
          `data:image/png;base64,${ImageG}`,
          `data:image/png;base64,${ImageB}`,
        ]);
      }
      const res2 = await getimgData(formData);

      if (res2?.success) {
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

        setFeatImages(allLayersData);
      }

      setLoading(false);
    };

    sendImage();
  }, [image]);
  const [modelpopUp, setModelpopUp] = useState<boolean>(false);
  const [firstLayerImgs, setFirstLayerImgs] = useState<string[]>([]);
  const [nextLayerImg, setNextLayerImg] = useState<string>("");

  const setModelpopUpHandler = (
    firstLayerImgs: string[],
    nextLayerImage: string
  ) => {
    setModelpopUp(true);
    setFirstLayerImgs(firstLayerImgs);
    setNextLayerImg(nextLayerImage);
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="w-full relative min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">
          CNN & LLM Visualizer
        </h1>
      </nav>

      <div className="flex flex-col items-center justify-center mt-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
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
          <label
            className=" inline-flex items-center 
           cursor-pointer"
          >
            <input
              onClick={animationHandler}
              type="checkbox"
              value=""
              className="sr-only peer"
            />
            <div
              className="relative  bg-blue-600 w-11 h-5 
         
       
        rounded-full  peer peer-checked:after:translate-x-full
         rtl:peer-checked:after:-translate-x-full
         peer-checked:after:border-buffer after:content-['']
          after:absolute after:top-0.5 after:start-1.5 
           after:bg-white after:rounded-full
           after:h-4 after:w-4 after:transition-all
           peer-checked:bg-brand"
            ></div>
            <span className="select-none ms-3 text-sm font-medium text-heading">
              Animation
            </span>
          </label>
        </div>

        {loading && (
          <div className="text-blue-600 font-medium mb-4">
            Processing image...
          </div>
        )}

        {imagePreview && (
          <VisualizationContainer
            setModelpopUpHandler={(first: string[], next: string) => {
              setModelpopUpHandler(first, next);
            }}
            animation={animation}
            featImages={featImages}
            imagePreview={imagePreview}
          />
        )}

        <ConvolutionMap
          nextLayerImg={nextLayerImg}
          firstLayerImgs={firstLayerImgs}
          modelPopUp={modelpopUp}
        />

        {!imagePreview && (
          <div className="text-gray-500 text-center mt-10">
            <p className="text-lg">
              Upload an image to see the CNN visualization
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;

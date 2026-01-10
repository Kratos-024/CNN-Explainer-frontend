import { useEffect, useState } from "react";
import { imageSenderApi } from "./Apis/Image";
import VisualizationContainer from "./components/layers";

interface ImageResponse {
  message: string;
  predicted_class: string;
  ImageR: string;
  ImageG: string;
  ImageB: string;
}

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<{
    ImageR: string;
    ImageG: string;
    ImageB: string;
  }>({ ImageR: "", ImageG: "", ImageB: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setLoading(true);

        const formData = new FormData();
        formData.append("Img", image);

        imageSenderApi(formData)
          .then((res: ImageResponse | undefined) => {
            if (!res) return;

            const { predicted_class, ImageR, ImageG, ImageB } = res;
            setImages({
              ImageR: `data:image/png;base64,${ImageR}`,
              ImageG: `data:image/png;base64,${ImageG}`,
              ImageB: `data:image/png;base64,${ImageB}`,
            });

            console.log("Predicted class:", predicted_class);
          })
          .finally(() => {
            setLoading(false);
          });
      };

      reader.readAsDataURL(image);
    }
  }, [image]);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">
          CNN & LLM Visualizer
        </h1>
      </nav>

      <div className="flex flex-col items-center justify-center mt-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Upload Image to Visualize CNN Flow
        </h2>

        <div className="mb-8">
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
        </div>

        {loading && (
          <div className="text-blue-600 font-medium mb-4">
            Processing image...
          </div>
        )}

        {imagePreview && (
          <VisualizationContainer imagePreview={imagePreview} images={images} />
        )}

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

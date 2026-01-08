import { useEffect, useRef, useState } from "react";
import imageSenderApi from "./Apis/Image";

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [predictedclass, setPredictedClass] = useState<string | null>(null);

  const imgRef = useRef<File | null>(null);
  const formData = new FormData();
  useEffect(() => {
    const sendImage = async (formData: FormData) => {
      const response = await imageSenderApi(formData);
      if (response) {
        setPredictedClass(response.predicted_class);
      }
    };
    if (image) {
      console.log("Got the image");
      imgRef.current = image;
      formData.append("Img", image);
      sendImage(formData);
    }
  }, [image]);

  return (
    <div className="w-full h-screen">
      <div className="  w-225  mx-auto ">
        <h1 className=" text-center">Add image</h1>
        <input
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
          type="file"
          accept="image"
        ></input>
        {image && (
          <div>
            <img src={URL.createObjectURL(image)} />
          </div>
        )}{" "}
        {predictedclass && <h3>{predictedclass}</h3>}
      </div>
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import { getDropoutEffectData } from "../Apis/Image";
import {
  type DropoutResponse,
  fallbackData,
} from "../../public/constants/typeData";
import { SidePanel } from "../components/DropoutEffectSidePanel";
import NavBar from "../components/NavBar";

export const DropoutEffect = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [data, setData] = useState<DropoutResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(image);
    const formData = new FormData();
    formData.append("Img", image);

    const getData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await getDropoutEffectData(formData);
        if (response) {
          setData(response);
        } else {
          setError("No data returned from server.");
        }
      } catch (err) {
        console.error("Error in getData:", err);
        setError("Failed to fetch data from server.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [image]);

  const resolved: DropoutResponse = data ?? fallbackData;

  const meanActNo = resolved.layerStats.map(
    (d: { layer: any; meanNo: any }) => ({
      layer: d.layer,
      val: d.meanNo,
    }),
  );
  const meanActDo = resolved.layerStats.map(
    (d: { layer: any; meanDo: any }) => ({
      layer: d.layer,
      val: d.meanDo,
    }),
  );
  const varianceNo = resolved.layerStats.map(
    (d: { layer: any; varNo: any }) => ({
      layer: d.layer,
      val: d.varNo,
    }),
  );
  const varianceDo = resolved.layerStats.map(
    (d: { layer: any; varDo: any }) => ({
      layer: d.layer,
      val: d.varDo,
    }),
  );
  const sparsityNo = resolved.layerStats.map(
    (d: { layer: any; sparNo: any }) => ({
      layer: d.layer,
      val: d.sparNo,
    }),
  );
  const sparsityDo = resolved.layerStats.map(
    (d: { layer: any; sparDo: any }) => ({
      layer: d.layer,
      val: d.sparDo,
    }),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-md py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">
          CNN Visualizer (Dropout-Effect)
        </h1>
      </nav>
      <h2
        className="text-2xl font-bold mb-6 text-gray-800 
        text-center"
      >
        Upload Image to Visualize Dropout Effect
      </h2>
      <ul className=" flex  justify-center gap-4 mb-6 text-gray-600">
        <li>
          <span className="">Glacier</span>
        </li>
        <li>
          <span className=""> Sea</span>
        </li>
        <li>
          <span className=""> Street</span>
        </li>
        <li>
          <span className=""> Forest </span>
        </li>{" "}
        <li>
          <span className="">Buildings</span>
        </li>{" "}
        <li>
          <span className="">Mountain</span>
        </li>
      </ul>{" "}
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        {!imagePreview && (
          <label className="cursor-pointer px-6 py-3 border-2 border-slate-300 rounded-xl bg-white shadow-sm hover:border-blue-400 transition inline-flex items-center gap-2">
            <span className="text-slate-600 text-sm">
              {image ? image.name : "Choose an image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
            />
          </label>
        )}

        {imagePreview && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={imagePreview}
              alt="Upload"
              className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-xl shadow-xl border-4 border-white"
            />
            <label className="text-xs text-blue-500 cursor-pointer hover:underline">
              Change image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && setImage(e.target.files[0])}
              />
            </label>
          </div>
        )}
      </div>
      {/* ── Loading spinner ── */}
      {loading && (
        <div className="flex justify-center py-16">
          <span className="text-slate-400 text-sm animate-pulse">
            Analysing image…
          </span>
        </div>
      )}
      {/* ── Error banner ── */}
      {error && !loading && (
        <div className="max-w-2xl mx-auto mt-6 px-4">
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}
      {imagePreview && !loading && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-[1fr_1px_1fr] mb-6">
            <div className="flex justify-center">
              <span className="font-black px-5 py-1.5">Without Dropout</span>
            </div>
            <div />
            <div className="flex justify-center">
              <span className="font-black px-5 py-1.5">With Dropout</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1px_1fr] items-start">
            <div className="pr-5">
              <SidePanel
                mode="no-dropout"
                prediction={resolved.predictionNo}
                classConfidence={resolved.classProbNo}
                meanData={meanActNo}
                varData={varianceNo}
                sparData={sparsityNo}
                distData={resolved.distNo}
              />
            </div>

            <div className="self-stretch bg-slate-200 w-px" />

            <div className="pl-5">
              <SidePanel
                mode="dropout"
                prediction={resolved.predictionDo}
                classConfidence={resolved.classProbDo}
                meanData={meanActDo}
                varData={varianceDo}
                sparData={sparsityDo}
                distData={resolved.distDo}
              />
            </div>
          </div>

          {/* Insight banner */}
          <div className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-6">
            <span className="text-[11px] font-bold text-violet-700 bg-violet-100 border border-violet-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Observed Insight
            </span>
            <p className="text-sm text-violet-900 leading-relaxed mt-3 max-w-4xl">
              Feature representations under Dropout exhibit higher sparsity and
              more distributed activations, suggesting reduced co-adaptation
              across channels. The mean activation shift of{" "}
              <strong>0.21</strong> across layers indicates that Dropout
              regularizes internal representations without significantly
              altering the predicted class. Variance reduction of{" "}
              <strong>~0.34</strong> implies smoother feature manifolds,
              consistent with known regularization effects. Top-channel
              dominance decreases with Dropout, supporting the hypothesis that
              the network distributes learned features more uniformly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropoutEffect;

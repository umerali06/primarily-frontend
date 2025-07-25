import React, { useState } from "react";

const LABEL_TYPES = [
  { id: "basic", name: "Basic Label", preview: "🔖" },
  { id: "barcode", name: "Barcode Label", preview: "🏷️" },
  { id: "qr", name: "QR Code Label", preview: "🔲" },
];

const CreateLabelModal = ({ open, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [labelOptions, setLabelOptions] = useState({});

  if (!open) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleCreate = () => {
    if (onCreate) onCreate({ type: selectedType, options: labelOptions });
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-0 w-full max-w-lg relative animate-fadeIn">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Step indicator */}
        <div className="flex items-center gap-2 px-8 pt-8 pb-2">
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${
              step === 1 ? "btn-primary" : "bg-[#e6f3f1]"
            }`}
          >
            1
          </span>
          <span className="text-gray-400">—</span>
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${
              step === 2 ? "btn-primary" : "bg-[#e6f3f1]"
            }`}
          >
            2
          </span>
          <span className="ml-4 text-gray-700 font-semibold">
            {step === 1 ? "Label type" : "Label options"}
          </span>
        </div>
        {/* Content */}
        <div className="px-8 pb-8 pt-2">
          {step === 1 && (
            <>
              <div className="mb-4 text-lg font-bold text-gray-800">
                Choose label type to see preview
              </div>
              <div className="flex gap-4 mb-6">
                {LABEL_TYPES.map((type) => (
                  <button
                    key={type.id}
                    className={`flex flex-col items-center border-2 rounded-xl p-4 w-32 h-32 transition-all duration-150 ${
                      selectedType === type.id
                        ? "border-primary bg-[#e6f3f1]"
                        : "border-gray-200 bg-white"
                    } hover:border-[var(--primary-light)]`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <span className="text-4xl mb-2">{type.preview}</span>
                    <span className="font-medium text-gray-700 text-center">
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
              <button
                className={`w-full py-3 rounded-lg font-semibold text-white btn-primary hover:btn-primary-hover transition-all duration-150 ${
                  !selectedType ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!selectedType}
                onClick={handleNext}
              >
                Next
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-4 text-lg font-bold text-gray-800">
                LABEL OPTIONS
              </div>
              {/* Placeholder for label options */}
              <div className="mb-6">
                <label className="block mb-2 text-gray-700 font-medium">
                  Label Name
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50"
                  type="text"
                  placeholder="Enter label name"
                  value={labelOptions.name || ""}
                  onChange={(e) =>
                    setLabelOptions({ ...labelOptions, name: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-150"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="flex-1 py-3 rounded-lg font-semibold text-white btn-primary hover:btn-primary-hover transition-all duration-150"
                  onClick={handleCreate}
                  disabled={!labelOptions.name}
                >
                  Create Label
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLabelModal;

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import PhotoUploadBox from "./PhotoUploadBox";
import GreenButton from "./GreenButton";
import FolderDropdown from "./FolderDropdown";
import useInventory from "../hooks/useInventory";
import toast from "react-hot-toast";

const AddFolderModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [folder, setFolder] = useState("all");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { createFolder } = useInventory();

  const resetForm = () => {
    setName("");
    setDescription("");
    setTags("");
    setNotes("");
    setFolder("all");
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }

    setIsLoading(true);
    try {
      const folderData = {
        name: name.trim(),
        description: description.trim(),
        tags: tags
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        notes: notes.trim(),
        parentId: folder === "all" ? null : folder,
        images: images,
      };

      await createFolder(folderData);
      toast.success("Folder created successfully!");
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create folder");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-4"
      style={{
        background: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-100 animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-md focus:outline-none"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
          aria-label="Close"
        >
          <IoClose size={28} />
        </button>
        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 min-h-0">
          <h2 className="text-xl font-semibold mb-6 text-center text-primary">
            Add Folder
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium">
              Name<span className="text-green-500">*</span>
            </label>
            <input
              className="w-full border-b-2 mb-4 focus-primary outline-none text-lg px-1 py-2 border-green-400"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="block mb-2 font-medium">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus-primary mb-4 resize-none"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="block mb-2 font-medium">
              Tags (comma separated)
            </label>
            <input
              className="w-full border rounded px-3 py-2 focus-primary mb-4"
              placeholder="e.g. office, storage, equipment"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <label className="block mb-2 font-medium">Notes</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus-primary mb-4 resize-none"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <PhotoUploadBox onFilesChange={setImages} />

            <button
              type="button"
              className="flex items-center gap-2 text-gray-700 font-medium mb-4"
              onClick={() => {}}
            >
              <span role="img" aria-label="fields">
                🗂️
              </span>{" "}
              Show all fields
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <FolderDropdown value={folder} onChange={setFolder} />
              <GreenButton
                type="submit"
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add"}
              </GreenButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;

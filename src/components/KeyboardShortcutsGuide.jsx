import React from "react";
import { TbKeyboard } from "react-icons/tb";

/**
 * Component to display keyboard shortcuts guide
 */
const KeyboardShortcutsGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <TbKeyboard className="mr-2" size={24} />
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                General Shortcuts
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Ctrl + A
                        </kbd>
                      </td>
                      <td className="py-2">Select all items</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Delete
                        </kbd>{" "}
                        or{" "}
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Backspace
                        </kbd>
                      </td>
                      <td className="py-2">Delete selected item</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Enter
                        </kbd>
                      </td>
                      <td className="py-2">View details of selected item</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          ?
                        </kbd>
                      </td>
                      <td className="py-2">Show this shortcuts guide</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                List & Table View Navigation
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          ↑
                        </kbd>
                      </td>
                      <td className="py-2">Select previous item</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          ↓
                        </kbd>
                      </td>
                      <td className="py-2">Select next item</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Home
                        </kbd>
                      </td>
                      <td className="py-2">Select first item</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          End
                        </kbd>
                      </td>
                      <td className="py-2">Select last item</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Page Up
                        </kbd>
                      </td>
                      <td className="py-2">Select item 10 positions up</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Page Down
                        </kbd>
                      </td>
                      <td className="py-2">Select item 10 positions down</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Grid View Navigation
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          ↑
                        </kbd>
                      </td>
                      <td className="py-2">Select item in row above</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          ↓
                        </kbd>
                      </td>
                      <td className="py-2">Select item in row below</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          ←
                        </kbd>
                      </td>
                      <td className="py-2">Select item to the left</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          →
                        </kbd>
                      </td>
                      <td className="py-2">Select item to the right</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          Home
                        </kbd>
                      </td>
                      <td className="py-2">Select first item</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono">
                          End
                        </kbd>
                      </td>
                      <td className="py-2">Select last item</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 btn-primary text-white rounded-md hover:btn-primary-hover focus:outline-none focus:ring-2 focus:ring-primary ring-opacity-50 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsGuide;

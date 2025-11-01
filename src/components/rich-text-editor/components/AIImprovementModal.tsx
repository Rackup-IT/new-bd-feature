interface AIImprovementModalProps {
  selectedText: string;
  improvedText: string;
  error: string | null;
  isImproving: boolean;
  onImprove: () => void;
  onApply: () => void;
  onClose: () => void;
}

const AIImprovementModal = ({
  selectedText,
  improvedText,
  error,
  isImproving,
  onImprove,
  onApply,
  onClose,
}: AIImprovementModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">AI Text Improvement</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Text:
            </label>
            <div className="p-3 bg-gray-50 rounded border">{selectedText}</div>
          </div>

          {improvedText && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Improved Text:
              </label>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                {improvedText}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {!improvedText ? (
            <>
              <button
                onClick={onImprove}
                disabled={isImproving}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {isImproving ? "Improving..." : "Improve with AI"}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onApply}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Apply Improvement
              </button>
              <button
                onClick={onImprove}
                disabled={isImproving}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {isImproving ? "Re-improving..." : "Try Again"}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImprovementModal;

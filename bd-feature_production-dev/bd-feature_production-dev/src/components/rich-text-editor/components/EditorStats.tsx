interface EditorStatsProps {
  wordCount: number;
  readMinutes: number;
}

const EditorStats = ({ wordCount, readMinutes }: EditorStatsProps) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t">
      <div className="text-xs text-gray-600">{`${wordCount} words · ~${readMinutes} min read`}</div>
      <div className="text-xs text-gray-500">Autosave enabled</div>
    </div>
  );
};

export default EditorStats;

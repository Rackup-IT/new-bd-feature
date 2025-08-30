// components/ui/FileInput.tsx

interface Props {
  onChange: (files: FileList) => void;
  error?: string;
}

export function FileInput({ onChange, error }: Props) {
  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && onChange(e.target.files)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

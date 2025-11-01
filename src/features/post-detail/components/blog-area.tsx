export default function BlogArea({ content }: { content: string }) {
  return (
    <div
      className="content-body text-[18px] leading-[1.6] pb-3 lg:text-[22px] lg:leading-[1.6] font-serif text-gray-900"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

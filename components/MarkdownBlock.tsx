type MarkdownBlockProps = {
  content: string;
  className?: string;
};

export function MarkdownBlock({ content, className = "" }: MarkdownBlockProps) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    nodes.push(
      <ul key={`list-${nodes.length}`}>
        {listItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      nodes.push(<h2 key={`h-${index}`}>{trimmed.replace(/^##\s+/, "")}</h2>);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      return;
    }

    flushList();
    nodes.push(<p key={`p-${index}`}>{trimmed}</p>);
  });

  flushList();

  return <div className={`techprep-prose ${className}`}>{nodes}</div>;
}

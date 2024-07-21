import React, { useMemo, useCallback, useState, useEffect } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

// Define the editor component
const SlateEditor: React.FC<{ initialContent: Descendant[] }> = ({
  initialContent,
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialContent);

  useEffect(() => {
    // Update value when initialContent changes
    setValue(initialContent);
  }, [initialContent]);

  // Function to toggle text formatting marks
  const toggleMark = (editor: any, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  // Check if a formatting mark is active
  const isMarkActive = (editor: any, format: string) => {
    const marks: any = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  // MarkButton component for applying formatting
  const MarkButton = ({ format, children }: any) => {
    const editor = useSlate();
    return (
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
      >
        {children}
      </button>
    );
  };

  // Render elements based on type
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  // Render text formatting marks
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text..."
        />
      </div>
    </Slate>
  );
};

// Leaf component to render text formatting
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  return <span {...attributes}>{children}</span>;
};

// Element component to render different block types
const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case "heading":
      return <h1 {...attributes}>{children}</h1>;
    case "paragraph":
      return <p {...attributes}>{children}</p>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default SlateEditor;

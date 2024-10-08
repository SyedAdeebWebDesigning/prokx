export const formatDescriptionInCard = (text: string) => {
  // Split the text by newlines to handle bullet points and formatting
  const lines = text.split("\n");

  return (
    <div>
      {lines.map((line, index) => {
        // Handle bullet points
        if (line.startsWith("- ")) {
          const bulletPointText = line.replace(/^-\s*/, "");

          // Split the line into parts, where **text** should be bold
          const parts = bulletPointText.split(/(\*\*.*?\*\*)/g).filter(Boolean);

          return (
            <div key={index} className="text-base">
              {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  // Remove the ** from the text and make it bold
                  return <p key={i}>{part.slice(2, -2)}</p>;
                } else {
                  return <span key={i}>{part}</span>;
                }
              })}
            </div>
          );
        }

        // Handle lines without bullet points
        return (
          <p key={index} className="text-base">
            {line}
          </p>
        );
      })}
    </div>
  );
};

export const formatDescription = (text: string) => {
  // Split the text by newlines to handle bullet points and formatting
  const lines = text.split("\n");

  return (
    <div>
      {lines.map((line, index) => {
        // Handle bullet points
        if (line.startsWith("- ")) {
          const bulletPointText = line.replace(/^-\s*/, "• ");

          // Split the line into parts, where **text** should be bold
          const parts = bulletPointText.split(/(\*\*.*?\*\*)/g).filter(Boolean);

          return (
            <p key={index} className="text-base">
              {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  // Remove the ** from the text and make it bold
                  return <strong key={i}>{part.slice(2, -2)}</strong>;
                } else {
                  return <span key={i}>{part}</span>;
                }
              })}
            </p>
          );
        }

        // Handle lines without bullet points
        return (
          <p key={index} className="text-base">
            {line}
          </p>
        );
      })}
    </div>
  );
};

export const transformDescription = (text: string) => {
  // Replace hyphens with bullet points
  let transformedText = text.replaceAll("- ", "•");
  // Replace **content** with <b>content</b>
  transformedText = transformedText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  // Replace line breaks with <br> tags
  transformedText = transformedText.replace(/\n/g, "<br>");
  return transformedText;
};

//import styles from './Source.module.scss';
import Editor from "@monaco-editor/react";
import type { MapperElement } from "models/MapDocument";

export interface SourceProps {
  element: MapperElement;
}

function Source ({
  element,
}: SourceProps) {

  return (
    <Editor
      height="80vh"
      defaultLanguage='json'
      value={JSON.stringify(element, null, 2)}
      theme='vs-light'
      options={{
        minimap: {
          enabled: false,
        },
      }}
    />
  );
}

export default Source;

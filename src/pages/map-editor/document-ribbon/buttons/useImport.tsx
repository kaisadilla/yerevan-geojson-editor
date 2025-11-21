import fileOpen from "file-open";
import { loadGeojsonFile } from "lib/mapperConvert";
import { openImportDocument } from "pages/map-editor/modals/ImportDocument";

export default function useImport () {
  async function handleImport () {
    const files = await fileOpen({
      multiple: false,
      accept: ".geojson,application/geo+json,.json,application/json",
    });

    if (files.length < 1) return;

    const elements = loadGeojsonFile(files[0].contents);
    if (elements === null) return;

    openImportDocument({
      elements,
    });
  }

  return {
    handleImport,
  }
}

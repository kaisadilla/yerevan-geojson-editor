
export function useFileLoading () {
  function loadFile (accept: string = "*/*") : Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.style.display = 'none';

      input.onchange = () => {
        const f = input.files?.[0] ?? null;
        resolve(f);

        document.body.removeChild(input);
      };

      document.body.appendChild(input);
      input.click();
    });
  }

  return {
    loadFile,
  };
}

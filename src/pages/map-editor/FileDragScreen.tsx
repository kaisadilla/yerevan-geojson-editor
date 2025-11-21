import { useEffect, useRef, useState } from 'react';
import styles from './FileDragScreen.module.scss';

export interface FileDragScreenProps {
  
}

function FileDragScreen (props: FileDragScreenProps) {
  const [isDragging, setDragging] = useState(false);
  let dragCounter = useRef(0);

  useEffect(() =>  {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  if (isDragging === false) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dropArea}>
        Drop here to open 
      </div>
    </div>
  );

  function handleDragEnter (evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer?.types.includes('Files') === false) return;

    dragCounter.current++;
    setDragging(true);
  }

  function handleDragLeave (evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    dragCounter.current--;

    if (dragCounter.current <= 0) {
      setDragging(false);
    }
  }

  function handleDragOver (evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

  }

  function handleDrop (evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    setDragging(false);
    console.log("dropped", evt.dataTransfer?.files);
  }
}

export default FileDragScreen;

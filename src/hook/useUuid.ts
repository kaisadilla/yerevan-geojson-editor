import { useRef } from "react";
import { v4 } from "uuid";

export default function useUuid () {
  const uuid = useRef<string>(v4());

  function next () {
    const curr = uuid.current;
    uuid.current = v4();

    return curr;
  }

  return {
    /**
     * Returns the next uuid that will be generated.
     */
    peek: () => uuid.current,
    /**
     * Generates a new uuid.
     */
    next,
  }
}

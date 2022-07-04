import { useCallback, useState } from "react";

export function useInput(init = "") {
  var [value, setValue] = useState(init);

  function onChange(e: React.ChangeEvent<HTMLInputElement> | string) {
    if (typeof e == "string") {
      setValue(e);
    } else {
      var target = e.target;
      setValue(target.value);
    }
  }

  function clear() {
    setValue("");
  }

  var ret = {
    value,
    onChange: useCallback(onChange, []),
    // clear: useCallback(clear, []),
  };

  Object.defineProperty(ret, "clear", {
    value: useCallback(clear, []),
  });

  return ret;
}
